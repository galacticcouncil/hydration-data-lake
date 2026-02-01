/**
 * Migration Validation Script
 * Compares data between a reaper database and harvester to ensure correct migration
 *
 * Usage:
 *   node validate-migration.js <reaper-db-url> [options]
 *
 * Options:
 *   --reaper-index <number>    Reaper index number (for filtering harvester data)
 *   --sample-size <number>     Number of random records to validate per table (default: 10)
 *   --tables <table1,table2>   Comma-separated list of tables to validate (default: all)
 *   --skip-sampling            Skip random record sampling
 *   --skip-checksums           Skip checksum validation
 *
 * Examples:
 *   node validate-migration.js "postgresql://user:pass@host:5432/reaper_db" --reaper-index 1
 *   node validate-migration.js "postgresql://user:pass@host:5432/reaper_db" --reaper-index 1 --sample-size 20
 *   node validate-migration.js "postgresql://user:pass@host:5432/reaper_db" --reaper-index 1 --tables "swap,transfer"
 */

const { Pool } = require('pg');
const config = require('./config');
const { log } = require('./utils/logger');
const { getTables, hasIdColumn } = require('./database/schema');

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);

  const options = {
    reaperDbUrl: args[0],
    reaperIndex: null,
    sampleSize: 10,
    tables: null,
    skipSampling: false,
    skipChecksums: false,
  };

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '--reaper-index':
        options.reaperIndex = parseInt(args[++i]);
        break;
      case '--sample-size':
        options.sampleSize = parseInt(args[++i]);
        break;
      case '--tables':
        options.tables = args[++i].split(',').map(t => t.trim());
        break;
      case '--skip-sampling':
        options.skipSampling = true;
        break;
      case '--skip-checksums':
        options.skipChecksums = true;
        break;
    }
  }

  return options;
}

/**
 * Validation result tracker
 */
class ValidationTracker {
  constructor() {
    this.results = {
      totalTables: 0,
      passedTables: 0,
      failedTables: 0,
      warnings: [],
      errors: [],
      tableResults: {},
    };
  }

  addTableResult(tableName, result) {
    this.results.tableResults[tableName] = result;
    this.results.totalTables++;

    if (result.passed) {
      this.results.passedTables++;
    } else {
      this.results.failedTables++;
    }

    if (result.errors) {
      result.errors.forEach(err => this.results.errors.push({ table: tableName, error: err }));
    }
    if (result.warnings) {
      result.warnings.forEach(warn => this.results.warnings.push({ table: tableName, warning: warn }));
    }
  }

  getReport() {
    const passed = this.results.failedTables === 0;
    return {
      summary: {
        passed,
        totalTables: this.results.totalTables,
        passedTables: this.results.passedTables,
        failedTables: this.results.failedTables,
        totalErrors: this.results.errors.length,
        totalWarnings: this.results.warnings.length,
      },
      tables: this.results.tableResults,
      errors: this.results.errors,
      warnings: this.results.warnings,
    };
  }

  printReport() {
    const report = this.getReport();

    log('\n' + '═'.repeat(80));
    log('MIGRATION VALIDATION REPORT');
    log('═'.repeat(80));
    log('');

    // Summary
    log('SUMMARY');
    log('─'.repeat(80));
    log(`Overall Status:      ${report.summary.passed ? '✓ PASSED' : '✗ FAILED'}`);
    log(`Total Tables:        ${report.summary.totalTables}`);
    log(`Passed Tables:       ${report.summary.passedTables} ✓`);
    log(`Failed Tables:       ${report.summary.failedTables} ${report.summary.failedTables > 0 ? '✗' : ''}`);
    log(`Total Errors:        ${report.summary.totalErrors}`);
    log(`Total Warnings:      ${report.summary.totalWarnings}`);
    log('');

    // Table details
    if (Object.keys(report.tables).length > 0) {
      log('TABLE VALIDATION RESULTS');
      log('─'.repeat(80));

      Object.entries(report.tables).forEach(([tableName, result]) => {
        const status = result.passed ? '✓' : '✗';
        log(`${status} ${tableName}`);

        if (result.rowCountMatch !== undefined) {
          log(`  Row Count: ${result.rowCountMatch ? '✓' : '✗'} (Reaper: ${result.reaperCount}, Harvester: ${result.harvesterCount})`);
        }

        if (result.idRangeMatch !== undefined) {
          log(`  ID Range:  ${result.idRangeMatch ? '✓' : '✗'} (Reaper: ${result.reaperIdRange}, Harvester: ${result.harvesterIdRange})`);
        }

        if (result.samplesMatch !== undefined) {
          log(`  Samples:   ${result.samplesMatch ? '✓' : '✗'} (${result.matchedSamples}/${result.totalSamples} matched)`);
        }

        if (result.checksumMatch !== undefined) {
          log(`  Checksum:  ${result.checksumMatch ? '✓' : '✗'}`);
        }

        if (result.warnings && result.warnings.length > 0) {
          result.warnings.forEach(warn => log(`  ⚠  ${warn}`, 'WARN'));
        }

        if (result.errors && result.errors.length > 0) {
          result.errors.forEach(err => log(`  ✗  ${err}`, 'ERROR'));
        }

        log('');
      });
    }

    // Errors
    if (report.errors.length > 0) {
      log('ERRORS');
      log('─'.repeat(80));
      report.errors.forEach(({ table, error }) => {
        log(`${table}: ${error}`, 'ERROR');
      });
      log('');
    }

    // Warnings
    if (report.warnings.length > 0) {
      log('WARNINGS');
      log('─'.repeat(80));
      report.warnings.forEach(({ table, warning }) => {
        log(`${table}: ${warning}`, 'WARN');
      });
      log('');
    }

    log('═'.repeat(80));
    log(`Validation ${report.summary.passed ? 'PASSED ✓' : 'FAILED ✗'}`);
    log('═'.repeat(80));

    return report.summary.passed;
  }
}

/**
 * Validate row counts match
 */
async function validateRowCount(reaperClient, harvesterClient, tableName, reaperIndex) {
  const reaperResult = await reaperClient.query(
    `SELECT COUNT(*) FROM ${config.SCHEMA_NAME}."${tableName}"`
  );
  const reaperCount = parseInt(reaperResult.rows[0].count);

  // For harvester, we need to filter by reaper_index if the table has that column
  let harvesterQuery = `SELECT COUNT(*) FROM ${config.SCHEMA_NAME}."${tableName}"`;

  // Check if table has reaper_index column
  const hasReaperIndex = await harvesterClient.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = '${config.SCHEMA_NAME}'
      AND table_name = '${tableName}'
      AND column_name = 'reaper_index'
  `);

  if (hasReaperIndex.rows.length > 0 && reaperIndex !== null) {
    harvesterQuery += ` WHERE reaper_index = ${reaperIndex}`;
  }

  const harvesterResult = await harvesterClient.query(harvesterQuery);
  const harvesterCount = parseInt(harvesterResult.rows[0].count);

  return {
    match: reaperCount === harvesterCount,
    reaperCount,
    harvesterCount,
  };
}

/**
 * Validate ID ranges match (min/max)
 */
async function validateIdRange(reaperClient, harvesterClient, tableName, reaperIndex) {
  const tableHasId = await hasIdColumn(reaperClient, tableName);

  if (!tableHasId) {
    return { hasId: false };
  }

  const reaperResult = await reaperClient.query(
    `SELECT MIN(id) as min_id, MAX(id) as max_id FROM ${config.SCHEMA_NAME}."${tableName}"`
  );
  const reaperRange = `${reaperResult.rows[0].min_id}-${reaperResult.rows[0].max_id}`;

  // For harvester, filter by reaper_index if available
  let harvesterQuery = `SELECT MIN(id) as min_id, MAX(id) as max_id FROM ${config.SCHEMA_NAME}."${tableName}"`;

  const hasReaperIndex = await harvesterClient.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = '${config.SCHEMA_NAME}'
      AND table_name = '${tableName}'
      AND column_name = 'reaper_index'
  `);

  if (hasReaperIndex.rows.length > 0 && reaperIndex !== null) {
    harvesterQuery += ` WHERE reaper_index = ${reaperIndex}`;
  }

  const harvesterResult = await harvesterClient.query(harvesterQuery);
  const harvesterRange = `${harvesterResult.rows[0].min_id}-${harvesterResult.rows[0].max_id}`;

  return {
    hasId: true,
    match: reaperRange === harvesterRange,
    reaperRange,
    harvesterRange,
  };
}

/**
 * Validate random sample of records
 */
async function validateRandomSamples(reaperClient, harvesterClient, tableName, reaperIndex, sampleSize) {
  const tableHasId = await hasIdColumn(reaperClient, tableName);

  if (!tableHasId) {
    return { hasId: false };
  }

  // Get random IDs from reaper
  const reaperSampleResult = await reaperClient.query(
    `SELECT id FROM ${config.SCHEMA_NAME}."${tableName}" ORDER BY RANDOM() LIMIT ${sampleSize}`
  );

  if (reaperSampleResult.rows.length === 0) {
    return { hasId: true, isEmpty: true, totalSamples: 0, matchedSamples: 0 };
  }

  const sampleIds = reaperSampleResult.rows.map(row => row.id);

  // Get column names (excluding reaper_index for comparison)
  const columnsResult = await reaperClient.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = '${config.SCHEMA_NAME}'
      AND table_name = '${tableName}'
      AND column_name != 'reaper_index'
    ORDER BY ordinal_position
  `);
  const columns = columnsResult.rows.map(row => row.column_name);
  const columnsList = columns.map(col => `"${col}"`).join(', ');

  // Fetch records from both databases
  const reaperRecords = await reaperClient.query(
    `SELECT ${columnsList} FROM ${config.SCHEMA_NAME}."${tableName}" WHERE id = ANY($1) ORDER BY id`,
    [sampleIds]
  );

  const harvesterRecords = await harvesterClient.query(
    `SELECT ${columnsList} FROM ${config.SCHEMA_NAME}."${tableName}" WHERE id = ANY($1) ORDER BY id`,
    [sampleIds]
  );

  // Compare records
  let matchedSamples = 0;
  const mismatches = [];

  for (let i = 0; i < reaperRecords.rows.length; i++) {
    const reaperRow = reaperRecords.rows[i];
    const harvesterRow = harvesterRecords.rows.find(r => r.id === reaperRow.id);

    if (!harvesterRow) {
      mismatches.push(`ID ${reaperRow.id}: Not found in harvester`);
      continue;
    }

    // Deep compare all columns
    let rowMatches = true;
    for (const col of columns) {
      const reaperVal = reaperRow[col];
      const harvesterVal = harvesterRow[col];

      // Handle JSON comparison
      if (typeof reaperVal === 'object' && typeof harvesterVal === 'object') {
        if (JSON.stringify(reaperVal) !== JSON.stringify(harvesterVal)) {
          rowMatches = false;
          mismatches.push(`ID ${reaperRow.id}, column "${col}": Values differ`);
        }
      } else if (reaperVal !== harvesterVal) {
        rowMatches = false;
        mismatches.push(`ID ${reaperRow.id}, column "${col}": Reaper=${reaperVal}, Harvester=${harvesterVal}`);
      }
    }

    if (rowMatches) {
      matchedSamples++;
    }
  }

  return {
    hasId: true,
    isEmpty: false,
    totalSamples: reaperRecords.rows.length,
    matchedSamples,
    mismatches: mismatches.slice(0, 5), // Only include first 5 mismatches
  };
}

/**
 * Validate table data checksum
 * Uses MD5 hash of concatenated sorted records for fast comparison
 */
async function validateChecksum(reaperClient, harvesterClient, tableName, reaperIndex) {
  const tableHasId = await hasIdColumn(reaperClient, tableName);

  if (!tableHasId) {
    return { hasId: false };
  }

  // Get column names (excluding reaper_index)
  const columnsResult = await reaperClient.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = '${config.SCHEMA_NAME}'
      AND table_name = '${tableName}'
      AND column_name != 'reaper_index'
    ORDER BY ordinal_position
  `);
  const columns = columnsResult.rows.map(row => `"${row.column_name}"`).join(', ');

  // Calculate checksum on sorted data
  const reaperChecksumQuery = `
    SELECT MD5(STRING_AGG(row_data::text, '' ORDER BY id)) as checksum
    FROM (
      SELECT id, ROW(${columns}) as row_data
      FROM ${config.SCHEMA_NAME}."${tableName}"
      ORDER BY id
    ) t
  `;

  let harvesterChecksumQuery = `
    SELECT MD5(STRING_AGG(row_data::text, '' ORDER BY id)) as checksum
    FROM (
      SELECT id, ROW(${columns}) as row_data
      FROM ${config.SCHEMA_NAME}."${tableName}"
  `;

  // Check if table has reaper_index column
  const hasReaperIndex = await harvesterClient.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = '${config.SCHEMA_NAME}'
      AND table_name = '${tableName}'
      AND column_name = 'reaper_index'
  `);

  if (hasReaperIndex.rows.length > 0 && reaperIndex !== null) {
    harvesterChecksumQuery += ` WHERE reaper_index = ${reaperIndex}`;
  }

  harvesterChecksumQuery += ` ORDER BY id
    ) t
  `;

  try {
    const reaperResult = await reaperClient.query(reaperChecksumQuery);
    const harvesterResult = await harvesterClient.query(harvesterChecksumQuery);

    const reaperChecksum = reaperResult.rows[0]?.checksum;
    const harvesterChecksum = harvesterResult.rows[0]?.checksum;

    return {
      hasId: true,
      match: reaperChecksum === harvesterChecksum,
      reaperChecksum,
      harvesterChecksum,
    };
  } catch (error) {
    // Checksum might fail for very large tables or complex data types
    return {
      hasId: true,
      error: error.message,
    };
  }
}

/**
 * Validate a single table
 */
async function validateTable(reaperClient, harvesterClient, tableName, reaperIndex, options) {
  log(`\nValidating table: ${tableName}`);

  const result = {
    passed: true,
    errors: [],
    warnings: [],
  };

  try {
    // 1. Validate row counts
    const rowCountResult = await validateRowCount(reaperClient, harvesterClient, tableName, reaperIndex);
    result.rowCountMatch = rowCountResult.match;
    result.reaperCount = rowCountResult.reaperCount;
    result.harvesterCount = rowCountResult.harvesterCount;

    if (!rowCountResult.match) {
      result.passed = false;
      result.errors.push(`Row count mismatch: Reaper=${rowCountResult.reaperCount}, Harvester=${rowCountResult.harvesterCount}`);
    } else {
      log(`  ✓ Row count matches: ${rowCountResult.reaperCount}`);
    }

    // 2. Validate ID ranges
    const idRangeResult = await validateIdRange(reaperClient, harvesterClient, tableName, reaperIndex);
    if (idRangeResult.hasId) {
      result.idRangeMatch = idRangeResult.match;
      result.reaperIdRange = idRangeResult.reaperRange;
      result.harvesterIdRange = idRangeResult.harvesterRange;

      if (!idRangeResult.match) {
        result.passed = false;
        result.errors.push(`ID range mismatch: Reaper=${idRangeResult.reaperRange}, Harvester=${idRangeResult.harvesterRange}`);
      } else {
        log(`  ✓ ID range matches: ${idRangeResult.reaperRange}`);
      }
    } else {
      log(`  ⊘ Table has no ID column, skipping ID range check`);
    }

    // 3. Validate random samples
    if (!options.skipSampling) {
      const samplesResult = await validateRandomSamples(reaperClient, harvesterClient, tableName, reaperIndex, options.sampleSize);

      if (samplesResult.hasId && !samplesResult.isEmpty) {
        result.samplesMatch = samplesResult.matchedSamples === samplesResult.totalSamples;
        result.matchedSamples = samplesResult.matchedSamples;
        result.totalSamples = samplesResult.totalSamples;

        if (!result.samplesMatch) {
          result.passed = false;
          result.errors.push(`Sample validation failed: ${samplesResult.matchedSamples}/${samplesResult.totalSamples} matched`);
          if (samplesResult.mismatches && samplesResult.mismatches.length > 0) {
            samplesResult.mismatches.forEach(mm => result.errors.push(`  - ${mm}`));
          }
        } else {
          log(`  ✓ Random samples match: ${samplesResult.totalSamples}/${samplesResult.totalSamples}`);
        }
      } else if (samplesResult.isEmpty) {
        log(`  ⊘ Table is empty, skipping sample validation`);
      }
    }

    // 4. Validate checksums
    if (!options.skipChecksums) {
      const checksumResult = await validateChecksum(reaperClient, harvesterClient, tableName, reaperIndex);

      if (checksumResult.hasId && !checksumResult.error) {
        result.checksumMatch = checksumResult.match;

        if (!checksumResult.match) {
          result.passed = false;
          result.errors.push(`Checksum mismatch: Reaper=${checksumResult.reaperChecksum}, Harvester=${checksumResult.harvesterChecksum}`);
        } else {
          log(`  ✓ Checksum matches: ${checksumResult.reaperChecksum}`);
        }
      } else if (checksumResult.error) {
        result.warnings.push(`Checksum validation failed: ${checksumResult.error}`);
        log(`  ⚠ Checksum validation failed: ${checksumResult.error}`, 'WARN');
      }
    }

  } catch (error) {
    result.passed = false;
    result.errors.push(`Validation error: ${error.message}`);
    log(`  ✗ Error: ${error.message}`, 'ERROR');
  }

  return result;
}

/**
 * Main validation function
 */
async function main() {
  const options = parseArgs();

  if (!options.reaperDbUrl) {
    console.error('Usage: node validate-migration.js <reaper-db-url> [options]');
    console.error('\nOptions:');
    console.error('  --reaper-index <number>    Reaper index number (required if harvester has reaper_index column)');
    console.error('  --sample-size <number>     Number of random records to validate per table (default: 10)');
    console.error('  --tables <table1,table2>   Comma-separated list of tables to validate (default: all)');
    console.error('  --skip-sampling            Skip random record sampling');
    console.error('  --skip-checksums           Skip checksum validation');
    process.exit(1);
  }

  log('═'.repeat(80));
  log('MIGRATION VALIDATION');
  log('═'.repeat(80));
  log('');
  log(`Reaper DB:       ${options.reaperDbUrl.replace(/:[^:@]+@/, ':***@')}`);
  log(`Harvester DB:    ${config.HARVESTER_DB_URL.replace(/:[^:@]+@/, ':***@')}`);
  log(`Reaper Index:    ${options.reaperIndex !== null ? options.reaperIndex : 'N/A'}`);
  log(`Sample Size:     ${options.sampleSize}`);
  log(`Skip Sampling:   ${options.skipSampling}`);
  log(`Skip Checksums:  ${options.skipChecksums}`);
  log('');

  const tracker = new ValidationTracker();

  const reaperPool = new Pool({ connectionString: options.reaperDbUrl });
  const harvesterPool = new Pool({ connectionString: config.HARVESTER_DB_URL });

  try {
    const reaperClient = await reaperPool.connect();
    const harvesterClient = await harvesterPool.connect();

    try {
      // Get tables to validate
      let tables = await getTables(reaperClient);

      if (options.tables) {
        tables = tables.filter(t => options.tables.includes(t));
        log(`Validating ${tables.length} specified tables: ${tables.join(', ')}`);
      } else {
        log(`Validating all ${tables.length} tables`);
      }

      // Validate each table
      for (const tableName of tables) {
        const result = await validateTable(reaperClient, harvesterClient, tableName, options.reaperIndex, options);
        tracker.addTableResult(tableName, result);
      }

      // Print final report
      const passed = tracker.printReport();

      // Exit with appropriate code
      process.exit(passed ? 0 : 1);

    } finally {
      reaperClient.release();
      harvesterClient.release();
    }
  } catch (error) {
    log(`Fatal error: ${error.message}`, 'ERROR');
    log(error.stack, 'ERROR');
    process.exit(1);
  } finally {
    await reaperPool.end();
    await harvesterPool.end();
  }
}

// Run validation
main();
