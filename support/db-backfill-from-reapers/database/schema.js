/**
 * Database schema discovery and analysis utilities
 */
const { log } = require('../utils/logger');
const config = require('../config');

/**
 * Get all tables from schema
 * @param {Object} client - PostgreSQL client
 * @returns {Promise<Array<string>>} Array of table names
 */
async function getTables(client) {
  const query = `
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = $1
    AND table_type = 'BASE TABLE'
    ORDER BY table_name;
  `;
  const result = await client.query(query, [config.SCHEMA_NAME]);
  return result.rows.map((row) => row.table_name);
}

/**
 * Get columns for a table
 * @param {Object} client - PostgreSQL client
 * @param {string} tableName - Name of the table
 * @returns {Promise<Array<string>>} Array of column names
 */
async function getTableColumns(client, tableName) {
  const query = `
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = $1 AND table_name = $2
    ORDER BY ordinal_position;
  `;
  const result = await client.query(query, [config.SCHEMA_NAME, tableName]);
  return result.rows.map((row) => row.column_name);
}

/**
 * Get columns with their data types for a table
 * @param {Object} client - PostgreSQL client
 * @param {string} tableName - Name of the table
 * @returns {Promise<Array<{name: string, type: string}>>} Array of column metadata
 */
async function getTableColumnsWithTypes(client, tableName) {
  const query = `
    SELECT column_name, data_type
    FROM information_schema.columns
    WHERE table_schema = $1 AND table_name = $2
    ORDER BY ordinal_position;
  `;
  const result = await client.query(query, [config.SCHEMA_NAME, tableName]);
  return result.rows.map((row) => ({
    name: row.column_name,
    type: row.data_type,
  }));
}

/**
 * Check if table has 'id' column
 * @param {Object} client - PostgreSQL client
 * @param {string} tableName - Name of the table
 * @returns {Promise<boolean>} True if table has id column
 */
async function hasIdColumn(client, tableName) {
  const query = `
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = $1 AND table_name = $2 AND column_name = 'id';
  `;
  const result = await client.query(query, [config.SCHEMA_NAME, tableName]);
  return result.rows.length > 0;
}

/**
 * Get foreign key dependencies for all tables
 * @param {Object} client - PostgreSQL client
 * @returns {Promise<Object>} Object mapping table names to their dependencies
 */
async function getTableDependencies(client) {
  const query = `
    SELECT
      tc.table_name as table_name,
      ccu.table_name AS referenced_table
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = $1
    ORDER BY tc.table_name;
  `;
  const result = await client.query(query, [config.SCHEMA_NAME]);

  const dependencies = {};
  result.rows.forEach((row) => {
    if (!dependencies[row.table_name]) {
      dependencies[row.table_name] = [];
    }
    if (row.referenced_table !== row.table_name) {
      // Ignore self-references
      dependencies[row.table_name].push(row.referenced_table);
    }
  });

  return dependencies;
}

/**
 * Topologically sort tables based on foreign key dependencies
 * @param {Array<string>} tables - Array of table names
 * @param {Object} dependencies - Object mapping table names to dependencies
 * @returns {Array<string>} Sorted array of table names
 */
function sortTablesByDependencies(tables, dependencies) {
  const sorted = [];
  const visited = new Set();
  const visiting = new Set();

  function visit(table) {
    if (visited.has(table)) return;
    if (visiting.has(table)) {
      // Circular dependency detected - add to sorted anyway
      log(`  Warning: Circular dependency detected for table ${table}`, 'WARN');
      return;
    }

    visiting.add(table);

    const deps = dependencies[table] || [];
    for (const dep of deps) {
      if (tables.includes(dep)) {
        visit(dep);
      }
    }

    visiting.delete(table);
    visited.add(table);
    sorted.push(table);
  }

  tables.forEach((table) => visit(table));

  return sorted;
}

module.exports = {
  getTables,
  getTableColumns,
  getTableColumnsWithTypes,
  hasIdColumn,
  getTableDependencies,
  sortTablesByDependencies,
};
