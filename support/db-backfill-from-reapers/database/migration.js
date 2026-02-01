/**
 * Table migration logic with batching and bulk inserts
 */
const { log } = require('../utils/logger');
const { saveProgress } = require('../utils/progress');
const { getTableColumnsWithTypes, hasIdColumn } = require('./schema');
const config = require('../config');
const reportTracker = require('../utils/reportTracker');

/**
 * Check if a column type is JSON or JSONB
 * @param {string} dataType - Column data type
 * @returns {boolean} True if column is JSON/JSONB
 */
function isJsonType(dataType) {
  if (!dataType) return false;
  const lowerType = dataType.toLowerCase();
  return lowerType === 'json' || lowerType === 'jsonb';
}

/**
 * Prepare value for insertion based on column type
 * @param {*} value - Raw value from source database
 * @param {string} dataType - Target column data type
 * @param {string} columnName - Column name (for error messages)
 * @returns {*} Prepared value
 */
function prepareValue(value, dataType, columnName = 'unknown') {
  if (value === null || value === undefined) {
    return null;
  }

  // Handle JSON/JSONB columns - ALWAYS stringify for PostgreSQL
  if (isJsonType(dataType)) {
    // If value is a string, validate it by parsing, then return the string
    if (typeof value === 'string') {
      try {
        // Validate by parsing
        JSON.parse(value);
        // Return the original string for PostgreSQL to parse
        return value;
      } catch (err) {
        log(
          `  Warning: Failed to parse JSON in column "${columnName}": ${value.substring(0, 100)}...`,
          'WARN'
        );
        throw new Error(
          `Invalid JSON value in column "${columnName}": ${err.message}`
        );
      }
    }
    // If already an object/array, stringify it for PostgreSQL
    if (typeof value === 'object') {
      try {
        return JSON.stringify(value);
      } catch (err) {
        log(
          `  Warning: Failed to stringify JSON in column "${columnName}"`,
          'WARN'
        );
        throw new Error(
          `Invalid JSON object in column "${columnName}": ${err.message}`
        );
      }
    }
    // Otherwise return as-is
    return value;
  }

  return value;
}

/**
 * Migrate data from reaper to harvester for a specific table
 * @param {Object} harvesterClient - Harvester database client
 * @param {Object} reaperClient - Reaper database client
 * @param {string} tableName - Name of the table to migrate
 * @param {number} reaperIndex - Index of the current reaper
 * @param {Object} progress - Progress tracking object
 */
async function migrateTable(
  harvesterClient,
  reaperClient,
  tableName,
  reaperIndex,
  progress
) {
  try {
    log(`  Migrating table: ${tableName}`);

    // Start tracking this table
    reportTracker.startTable(reaperIndex, tableName);

    // Get columns with types from HARVESTER (target) database, not reaper (source)
    // This ensures we prepare values according to target schema
    const columnsMetadata = await getTableColumnsWithTypes(
      harvesterClient,
      tableName
    );
    if (columnsMetadata.length === 0) {
      log(`  No columns found for table ${tableName}, skipping`, 'WARN');
      reportTracker.endTable(reaperIndex, tableName, 0, 0);
      return;
    }

    // Log JSON/JSONB columns for debugging
    const jsonColumns = columnsMetadata.filter((col) => isJsonType(col.type));
    if (jsonColumns.length > 0) {
      log(
        `  Detected ${jsonColumns.length} JSON/JSONB columns: ${jsonColumns.map((c) => `${c.name}(${c.type})`).join(', ')}`
      );
    }

    const columnNames = columnsMetadata.map((col) => col.name);
    const hasId = await hasIdColumn(reaperClient, tableName);

    // Count rows in reaper table
    const countResult = await reaperClient.query(
      `SELECT COUNT(*) FROM ${config.SCHEMA_NAME}."${tableName}"`
    );
    const totalRows = parseInt(countResult.rows[0].count);

    if (totalRows === 0) {
      log(`  Table ${tableName} is empty, skipping`);
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
      return;
    }

    // Prepare column list with quoted identifiers to handle reserved keywords
    const columnsList = columnNames.map((col) => `"${col}"`).join(', ');

    // Prepare bulk insert query template
    const insertQueryTemplate = buildInsertQueryTemplate(
      tableName,
      columnNames,
      columnsList,
      hasId
    );

    let totalInserted = 0;

    // Use cursor for streaming large result sets
    const cursorName = `cursor_${tableName}_${Date.now()}`;

    // Declare cursor
    await reaperClient.query('BEGIN');
    await reaperClient.query(
      `DECLARE ${cursorName} CURSOR FOR SELECT * FROM ${config.SCHEMA_NAME}."${tableName}" OFFSET ${processedRows}`
    );

    try {
      let hasMoreRows = true;

      while (hasMoreRows) {
        // Fetch batch
        const batchResult = await reaperClient.query(
          `FETCH ${config.BATCH_SIZE} FROM ${cursorName}`
        );

        if (batchResult.rows.length === 0) {
          hasMoreRows = false;
          break;
        }

        log(
          `  Processing batch: ${processedRows} - ${processedRows + batchResult.rows.length} of ${totalRows}`
        );

        // Process batch in bulk chunks
        const insertedCount = await processBatch(
          harvesterClient,
          batchResult.rows,
          columnsMetadata,
          insertQueryTemplate,
          tableName
        );

        totalInserted += insertedCount;
        processedRows += batchResult.rows.length;

        // Update progress
        progress.completedTables[tableKey] = processedRows;
        await saveProgress(progress);

        // Log progress every batch
        const percentage = ((processedRows / totalRows) * 100).toFixed(2);
        log(`  Progress: ${processedRows}/${totalRows} (${percentage}%)`);
      }

      await reaperClient.query(`CLOSE ${cursorName}`);
      await reaperClient.query('COMMIT');
    } catch (error) {
      await reaperClient.query('ROLLBACK');
      throw error;
    }

    log(`  Completed ${tableName}: ${totalInserted} rows processed`);

    // Estimate data size (rough estimate: avg 200 bytes per row * number of columns)
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
 * Build INSERT query template with ON CONFLICT handling
 * @param {string} tableName - Name of the table
 * @param {Array<string>} columns - Column names
 * @param {string} columnsList - Comma-separated quoted column names
 * @param {boolean} hasId - Whether table has id column
 * @returns {Function} Template function that takes values clause
 */
function buildInsertQueryTemplate(tableName, columns, columnsList, hasId) {
  if (hasId) {
    const updateSet = columns
      .filter((col) => col !== 'id')
      .map((col) => `"${col}" = EXCLUDED."${col}"`)
      .join(', ');
    return (valuesClause) => `
      INSERT INTO ${config.SCHEMA_NAME}."${tableName}" (${columnsList})
      VALUES ${valuesClause}
      ON CONFLICT (id) DO UPDATE SET ${updateSet}
    `;
  } else {
    return (valuesClause) => `
      INSERT INTO ${config.SCHEMA_NAME}."${tableName}" (${columnsList})
      VALUES ${valuesClause}
      ON CONFLICT DO NOTHING
    `;
  }
}

/**
 * Process a batch of rows with bulk inserts
 * @param {Object} harvesterClient - Harvester database client
 * @param {Array<Object>} rows - Batch of rows to insert
 * @param {Array<{name: string, type: string}>} columnsMetadata - Column metadata
 * @param {Function} insertQueryTemplate - Insert query template function
 * @param {string} tableName - Name of the table (for error logging)
 * @returns {Promise<number>} Number of rows inserted
 */
async function processBatch(
  harvesterClient,
  rows,
  columnsMetadata,
  insertQueryTemplate,
  tableName
) {
  let totalInserted = 0;

  // Split batch into smaller chunks for bulk insert
  for (let i = 0; i < rows.length; i += config.BULK_INSERT_SIZE) {
    const chunk = rows.slice(
      i,
      Math.min(i + config.BULK_INSERT_SIZE, rows.length)
    );

    // Build multi-row VALUES clause
    const valueClauses = [];
    const allValues = [];
    let paramIndex = 1;

    for (const row of chunk) {
      const rowPlaceholders = columnsMetadata
        .map(() => `$${paramIndex++}`)
        .join(', ');
      valueClauses.push(`(${rowPlaceholders})`);
      columnsMetadata.forEach((col) => {
        const preparedValue = prepareValue(row[col.name], col.type, col.name);
        allValues.push(preparedValue);
      });
    }

    const insertQuery = insertQueryTemplate(valueClauses.join(', '));

    try {
      const result = await harvesterClient.query(insertQuery, allValues);
      totalInserted += result.rowCount || 0;
    } catch (err) {
      log(
        `  Error inserting batch in ${tableName}: ${err.message}`,
        'ERROR'
      );
      // Try inserting rows individually for this chunk
      log(`  Retrying chunk row-by-row...`);
      totalInserted += await processChunkRowByRow(
        harvesterClient,
        chunk,
        columnsMetadata,
        insertQueryTemplate,
        tableName
      );
    }
  }

  return totalInserted;
}

/**
 * Process chunk row by row (fallback for failed bulk insert)
 * @param {Object} harvesterClient - Harvester database client
 * @param {Array<Object>} chunk - Chunk of rows
 * @param {Array<{name: string, type: string}>} columnsMetadata - Column metadata
 * @param {Function} insertQueryTemplate - Insert query template function
 * @param {string} tableName - Name of the table (for error logging)
 * @returns {Promise<number>} Number of rows inserted
 */
async function processChunkRowByRow(
  harvesterClient,
  chunk,
  columnsMetadata,
  insertQueryTemplate,
  tableName
) {
  let inserted = 0;
  const errors = [];

  for (const row of chunk) {
    const values = columnsMetadata.map((col) =>
      prepareValue(row[col.name], col.type, col.name)
    );
    const singleValuePlaceholders = columnsMetadata
      .map((_, idx) => `$${idx + 1}`)
      .join(', ');
    const singleInsertQuery = insertQueryTemplate(
      `(${singleValuePlaceholders})`
    );

    try {
      await harvesterClient.query(singleInsertQuery, values);
      inserted++;
    } catch (rowErr) {
      log(`  Error inserting single row: ${rowErr.message}`, 'ERROR');

      // Debug: Log the problematic value
      const jsonCols = columnsMetadata.filter((col) => isJsonType(col.type));
      if (jsonCols.length > 0) {
        jsonCols.forEach((col) => {
          const val = row[col.name];
          log(
            `  DEBUG: Column "${col.name}" type=${col.type} valueType=${typeof val} value=${JSON.stringify(val).substring(0, 200)}`,
            'WARN'
          );
        });
      }

      errors.push({
        error: rowErr.message,
        rowData: row,
      });
    }
  }

  // If all rows failed, throw an error to stop the migration
  if (inserted === 0 && errors.length > 0) {
    log(
      `  CRITICAL: All ${errors.length} rows in chunk failed to insert in table ${tableName}`,
      'ERROR'
    );
    log(`  First error: ${errors[0].error}`, 'ERROR');
    throw new Error(
      `Failed to insert all rows in chunk for table ${tableName}. First error: ${errors[0].error}`
    );
  }

  // If some rows failed but not all, log warning but continue
  if (errors.length > 0) {
    log(
      `  WARNING: ${errors.length} out of ${chunk.length} rows failed to insert in table ${tableName}`,
      'WARN'
    );
    log(
      `  This may indicate data inconsistency. First error: ${errors[0].error}`,
      'WARN'
    );
  }

  return inserted;
}

module.exports = {
  migrateTable,
};
