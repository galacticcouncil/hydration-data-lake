/**
 * Table migration logic with batching and bulk inserts
 */
const { log } = require('../utils/logger');
const { saveProgress } = require('../utils/progress');
const { getTableColumns, hasIdColumn } = require('./schema');
const config = require('../config');

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

    // Get columns
    const columns = await getTableColumns(reaperClient, tableName);
    if (columns.length === 0) {
      log(`  No columns found for table ${tableName}, skipping`, 'WARN');
      return;
    }

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
    const columnsList = columns.map((col) => `"${col}"`).join(', ');

    // Prepare bulk insert query template
    const insertQueryTemplate = buildInsertQueryTemplate(
      tableName,
      columns,
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
          columns,
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
  } catch (error) {
    log(`  Error migrating table ${tableName}: ${error.message}`, 'ERROR');
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
 * @param {Array<string>} columns - Column names
 * @param {Function} insertQueryTemplate - Insert query template function
 * @param {string} tableName - Name of the table (for error logging)
 * @returns {Promise<number>} Number of rows inserted
 */
async function processBatch(
  harvesterClient,
  rows,
  columns,
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
      const rowPlaceholders = columns.map(() => `$${paramIndex++}`).join(', ');
      valueClauses.push(`(${rowPlaceholders})`);
      columns.forEach((col) => allValues.push(row[col]));
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
        columns,
        insertQueryTemplate
      );
    }
  }

  return totalInserted;
}

/**
 * Process chunk row by row (fallback for failed bulk insert)
 * @param {Object} harvesterClient - Harvester database client
 * @param {Array<Object>} chunk - Chunk of rows
 * @param {Array<string>} columns - Column names
 * @param {Function} insertQueryTemplate - Insert query template function
 * @returns {Promise<number>} Number of rows inserted
 */
async function processChunkRowByRow(
  harvesterClient,
  chunk,
  columns,
  insertQueryTemplate
) {
  let inserted = 0;

  for (const row of chunk) {
    const values = columns.map((col) => row[col]);
    const singleValuePlaceholders = columns
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
    }
  }

  return inserted;
}

module.exports = {
  migrateTable,
};
