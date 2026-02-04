/**
 * Table migration logic using PostgreSQL COPY for maximum performance
 *
 * COPY is 5-10x faster than INSERT statements but requires special handling:
 * - Uses temporary tables for ON CONFLICT resolution
 * - Streams data in PostgreSQL COPY format (TSV)
 * - Handles NULL values and special characters
 */
const { log } = require('../utils/logger');
const { saveProgress } = require('../utils/progress');
const { getTableColumnsWithTypes, hasIdColumn } = require('./schema');
const config = require('../config');
const reportTracker = require('../utils/reportTracker');
const { from: copyFrom } = require('pg-copy-streams');
const { pipeline } = require('stream/promises');
const { Readable, Transform } = require('stream');

/**
 * Check if a column type is JSON or JSONB
 */
function isJsonType(dataType) {
  if (!dataType) return false;
  const lowerType = dataType.toLowerCase();
  return lowerType === 'json' || lowerType === 'jsonb';
}

/**
 * Escape value for PostgreSQL COPY format (TSV)
 * @param {*} value - Value to escape
 * @param {string} dataType - Column data type
 * @returns {string} Escaped value for COPY
 */
function escapeCopyValue(value, dataType) {
  if (value === null || value === undefined) {
    return '\\N'; // NULL in COPY format
  }

  // Handle JSON/JSONB - must be stringified
  if (isJsonType(dataType)) {
    if (typeof value === 'object') {
      value = JSON.stringify(value);
    } else if (typeof value === 'string') {
      // Validate JSON string
      try {
        JSON.parse(value);
      } catch (err) {
        throw new Error(`Invalid JSON value: ${err.message}`);
      }
    }
  }

  // Convert to string
  let str = String(value);

  // Escape special characters for COPY format
  // Backslash, tab, newline, carriage return
  str = str
    .replace(/\\/g, '\\\\')   // Backslash
    .replace(/\t/g, '\\t')    // Tab
    .replace(/\n/g, '\\n')    // Newline
    .replace(/\r/g, '\\r');   // Carriage return

  return str;
}

/**
 * Create a transform stream that converts rows to COPY format
 * @param {Array} columnsMetadata - Column metadata
 * @returns {Transform} Transform stream
 */
function createCopyFormatter(columnsMetadata) {
  return new Transform({
    objectMode: true,
    transform(row, encoding, callback) {
      try {
        const values = columnsMetadata.map((col) =>
          escapeCopyValue(row[col.name], col.type)
        );
        const line = values.join('\t') + '\n';
        callback(null, line);
      } catch (error) {
        callback(error);
      }
    }
  });
}

/**
 * Migrate data using PostgreSQL COPY command
 * This is significantly faster than INSERT statements
 *
 * @param {Object} harvesterClient - Harvester database client
 * @param {Object} reaperClient - Reaper database client
 * @param {string} tableName - Name of the table to migrate
 * @param {number} reaperIndex - Index of the current reaper
 * @param {Object} progress - Progress tracking object
 */
async function migrateTableWithCopy(
  harvesterClient,
  reaperClient,
  tableName,
  reaperIndex,
  progress
) {
  try {
    log(`  Migrating table: ${tableName} (using COPY)`);

    // Start tracking this table
    reportTracker.startTable(reaperIndex, tableName);

    // Get columns from HARVESTER (target) database
    const columnsMetadata = await getTableColumnsWithTypes(
      harvesterClient,
      tableName
    );
    if (columnsMetadata.length === 0) {
      log(`  No columns found for table ${tableName}, skipping`, 'WARN');
      reportTracker.endTable(reaperIndex, tableName, 0, 0);
      return;
    }

    // Filter out reaper_index column from source (it doesn't exist in reaper DBs)
    const sourceColumns = columnsMetadata.filter(col => col.name !== 'reaper_index');
    const columnNames = sourceColumns.map(col => col.name);
    const hasId = await hasIdColumn(reaperClient, tableName);

    // Count rows in reaper table
    const countResult = await reaperClient.query(
      `SELECT COUNT(*) FROM ${config.SCHEMA_NAME}."${tableName}"`
    );
    const totalRows = parseInt(countResult.rows[0].count);

    if (totalRows === 0) {
      log(`  Table ${tableName} is empty, skipping`);
      reportTracker.endTable(reaperIndex, tableName, 0, 0);
      return;
    }

    log(`  Found ${totalRows} rows in ${tableName}`);

    // Check if we're resuming this table
    const tableKey = `${reaperIndex}_${tableName}`;
    let processedRows = progress.completedTables[tableKey] || 0;

    if (processedRows > 0) {
      log(
        `  ✓ Resuming from row ${processedRows} of ${totalRows} (${((processedRows / totalRows) * 100).toFixed(2)}% complete)`
      );
    }

    if (processedRows >= totalRows) {
      log(
        `  ✓ Table ${tableName} already completed (${processedRows}/${totalRows} rows), skipping`
      );
      reportTracker.endTable(reaperIndex, tableName, processedRows, processedRows * 200 * columnsMetadata.length);
      return;
    }

    // Strategy: Use temporary table for COPY + ON CONFLICT resolution
    const useTempTable = hasId || config.DISABLE_FK_CHECKS === false;
    let totalInserted = 0;

    if (useTempTable) {
      totalInserted = await migrateViaTempTable(
        harvesterClient,
        reaperClient,
        tableName,
        reaperIndex,
        columnNames,
        sourceColumns,
        hasId,
        totalRows,
        processedRows,
        progress,
        tableKey
      );
    } else {
      // Direct COPY (no conflicts expected)
      totalInserted = await migrateDirectCopy(
        harvesterClient,
        reaperClient,
        tableName,
        reaperIndex,
        columnNames,
        sourceColumns,
        totalRows,
        processedRows,
        progress,
        tableKey
      );
    }

    log(`  Completed ${tableName}: ${totalInserted} rows processed`);

    // Estimate data size
    const estimatedBytesPerRow = columnsMetadata.length * 200;
    const estimatedBytes = totalInserted * estimatedBytesPerRow;

    // End tracking this table with stats
    reportTracker.endTable(reaperIndex, tableName, totalInserted, estimatedBytes);
  } catch (error) {
    log(`  Error migrating table ${tableName}: ${error.message}`, 'ERROR');
    reportTracker.recordError(`Table ${tableName}`, error.message);
    reportTracker.endTable(reaperIndex, tableName, 0, 0);
    throw error;
  }
}

/**
 * Migrate via temporary table (for ON CONFLICT support)
 */
async function migrateViaTempTable(
  harvesterClient,
  reaperClient,
  tableName,
  reaperIndex,
  columnNames,
  columnsMetadata,
  hasId,
  totalRows,
  processedRows,
  progress,
  tableKey
) {
  const tempTableName = `${tableName}_temp_${reaperIndex}_${Date.now()}`;
  const columnsList = columnNames.map(col => `"${col}"`).join(', ');

  try {
    // 1. Create temporary table with same structure (but no constraints)
    log(`  Creating temporary table: ${tempTableName}`);

    const createTempTableSQL = `
      CREATE TEMPORARY TABLE "${tempTableName}" (LIKE ${config.SCHEMA_NAME}."${tableName}" INCLUDING DEFAULTS)
    `;
    await harvesterClient.query(createTempTableSQL);

    // 2. COPY data into temporary table in batches
    log(`  Streaming data into temporary table via COPY...`);

    let batchProcessedRows = processedRows;
    let totalInserted = 0;

    // Process in batches to enable progress tracking
    const batchSize = config.BATCH_SIZE;

    while (batchProcessedRows < totalRows) {
      const batchStart = batchProcessedRows;
      const batchEnd = Math.min(batchStart + batchSize, totalRows);
      const currentBatchSize = batchEnd - batchStart;

      log(`  Processing batch: ${batchStart} - ${batchEnd} of ${totalRows}`);

      // Fetch batch from reaper
      const batchResult = await reaperClient.query(
        `SELECT ${columnsList} FROM ${config.SCHEMA_NAME}."${tableName}"
         ORDER BY ${hasId ? 'id' : '(SELECT NULL)'}
         OFFSET ${batchStart} LIMIT ${currentBatchSize}`
      );

      if (batchResult.rows.length === 0) {
        break;
      }

      // COPY batch into temp table
      const copyStream = harvesterClient.query(
        copyFrom(`COPY "${tempTableName}" (${columnsList}) FROM STDIN WITH (FORMAT text, NULL '\\N')`)
      );

      // Create readable stream from batch rows
      const rowsStream = Readable.from(batchResult.rows);
      const formatter = createCopyFormatter(columnsMetadata);

      await pipeline(rowsStream, formatter, copyStream);

      totalInserted += batchResult.rows.length;
      batchProcessedRows = batchEnd;

      // Update progress
      progress.completedTables[tableKey] = batchProcessedRows;
      await saveProgress(progress);

      const percentage = ((batchProcessedRows / totalRows) * 100).toFixed(2);
      log(`  Progress: ${batchProcessedRows}/${totalRows} (${percentage}%)`);
    }

    // 3. INSERT from temp table to main table with ON CONFLICT
    log(`  Merging data from temporary table to main table...`);

    let insertSQL;
    if (hasId) {
      const updateSet = columnNames
        .filter(col => col !== 'id')
        .map(col => `"${col}" = EXCLUDED."${col}"`)
        .join(', ');

      // Add reaper_index if it exists in target
      const hasReaperIndexResult = await harvesterClient.query(`
        SELECT column_name FROM information_schema.columns
        WHERE table_schema = '${config.SCHEMA_NAME}'
          AND table_name = '${tableName}'
          AND column_name = 'reaper_index'
      `);

      if (hasReaperIndexResult.rows.length > 0) {
        insertSQL = `
          INSERT INTO ${config.SCHEMA_NAME}."${tableName}" (${columnsList}, reaper_index)
          SELECT ${columnsList}, ${reaperIndex} FROM "${tempTableName}"
          ON CONFLICT (id) DO UPDATE SET ${updateSet}, reaper_index = EXCLUDED.reaper_index
        `;
      } else {
        insertSQL = `
          INSERT INTO ${config.SCHEMA_NAME}."${tableName}" (${columnsList})
          SELECT ${columnsList} FROM "${tempTableName}"
          ON CONFLICT (id) DO UPDATE SET ${updateSet}
        `;
      }
    } else {
      insertSQL = `
        INSERT INTO ${config.SCHEMA_NAME}."${tableName}" (${columnsList})
        SELECT ${columnsList} FROM "${tempTableName}"
        ON CONFLICT DO NOTHING
      `;
    }

    const insertResult = await harvesterClient.query(insertSQL);
    log(`  Inserted/Updated ${insertResult.rowCount || totalInserted} rows into main table`);

    // 4. Drop temporary table
    await harvesterClient.query(`DROP TABLE IF EXISTS "${tempTableName}"`);
    log(`  Temporary table dropped`);

    return totalInserted;
  } catch (error) {
    // Clean up temp table on error
    try {
      await harvesterClient.query(`DROP TABLE IF EXISTS "${tempTableName}"`);
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    throw error;
  }
}

/**
 * Migrate via direct COPY (no conflict resolution needed)
 */
async function migrateDirectCopy(
  harvesterClient,
  reaperClient,
  tableName,
  reaperIndex,
  columnNames,
  columnsMetadata,
  totalRows,
  processedRows,
  progress,
  tableKey
) {
  const columnsList = columnNames.map(col => `"${col}"`).join(', ');
  let totalInserted = 0;

  // Process in batches for progress tracking
  const batchSize = config.BATCH_SIZE;
  let batchProcessedRows = processedRows;

  while (batchProcessedRows < totalRows) {
    const batchStart = batchProcessedRows;
    const batchEnd = Math.min(batchStart + batchSize, totalRows);
    const currentBatchSize = batchEnd - batchStart;

    log(`  Processing batch: ${batchStart} - ${batchEnd} of ${totalRows}`);

    // Fetch batch from reaper
    const batchResult = await reaperClient.query(
      `SELECT ${columnsList} FROM ${config.SCHEMA_NAME}."${tableName}"
       OFFSET ${batchStart} LIMIT ${currentBatchSize}`
    );

    if (batchResult.rows.length === 0) {
      break;
    }

    // COPY directly into main table
    const copyStream = harvesterClient.query(
      copyFrom(`COPY ${config.SCHEMA_NAME}."${tableName}" (${columnsList}) FROM STDIN WITH (FORMAT text, NULL '\\N')`)
    );

    const rowsStream = Readable.from(batchResult.rows);
    const formatter = createCopyFormatter(columnsMetadata);

    await pipeline(rowsStream, formatter, copyStream);

    totalInserted += batchResult.rows.length;
    batchProcessedRows = batchEnd;

    // Update progress
    progress.completedTables[tableKey] = batchProcessedRows;
    await saveProgress(progress);

    const percentage = ((batchProcessedRows / totalRows) * 100).toFixed(2);
    log(`  Progress: ${batchProcessedRows}/${totalRows} (${percentage}%)`);
  }

  return totalInserted;
}

module.exports = {
  migrateTable: migrateTableWithCopy,
};
