/**
 * Migration report tracker - collects statistics during migration
 */
const fs = require('fs').promises;
const path = require('path');

class MigrationReportTracker {
  constructor() {
    this.reset();
  }

  reset() {
    this.startTime = null;
    this.endTime = null;
    this.reapers = {}; // Track per-reaper stats
    this.tables = {}; // Track per-table stats
    this.totalRecords = 0;
    this.totalBytes = 0;
    this.errors = [];
  }

  /**
   * Start tracking migration
   */
  startMigration() {
    this.startTime = new Date();
  }

  /**
   * End tracking migration
   */
  endMigration() {
    this.endTime = new Date();
  }

  /**
   * Start tracking a reaper
   * @param {number} reaperIndex - Reaper index
   */
  startReaper(reaperIndex) {
    this.reapers[reaperIndex] = {
      startTime: new Date(),
      endTime: null,
      records: 0,
      bytes: 0,
      tables: [],
    };
  }

  /**
   * End tracking a reaper
   * @param {number} reaperIndex - Reaper index
   */
  endReaper(reaperIndex) {
    if (this.reapers[reaperIndex]) {
      this.reapers[reaperIndex].endTime = new Date();
    }
  }

  /**
   * Start tracking a table
   * @param {number} reaperIndex - Reaper index
   * @param {string} tableName - Table name
   */
  startTable(reaperIndex, tableName) {
    const key = `${reaperIndex}_${tableName}`;
    this.tables[key] = {
      reaperIndex,
      tableName,
      startTime: new Date(),
      endTime: null,
      records: 0,
      bytes: 0,
    };
  }

  /**
   * End tracking a table and record stats
   * @param {number} reaperIndex - Reaper index
   * @param {string} tableName - Table name
   * @param {number} records - Number of records migrated
   * @param {number} bytes - Approximate bytes migrated
   */
  endTable(reaperIndex, tableName, records, bytes) {
    const key = `${reaperIndex}_${tableName}`;
    if (this.tables[key]) {
      this.tables[key].endTime = new Date();
      this.tables[key].records = records;
      this.tables[key].bytes = bytes;

      // Update totals
      this.totalRecords += records;
      this.totalBytes += bytes;

      // Update reaper totals
      if (this.reapers[reaperIndex]) {
        this.reapers[reaperIndex].records += records;
        this.reapers[reaperIndex].bytes += bytes;
        this.reapers[reaperIndex].tables.push(tableName);
      }
    }
  }

  /**
   * Record an error
   * @param {string} context - Error context (reaper/table)
   * @param {string} message - Error message
   */
  recordError(context, message) {
    this.errors.push({
      timestamp: new Date(),
      context,
      message,
    });
  }

  /**
   * Calculate duration in seconds
   * @param {Date} start - Start time
   * @param {Date} end - End time
   * @returns {number} Duration in seconds
   */
  getDurationSeconds(start, end) {
    if (!start || !end) return 0;
    return (end - start) / 1000;
  }

  /**
   * Format bytes to human-readable format
   * @param {number} bytes - Bytes
   * @returns {string} Formatted string
   */
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Format duration to human-readable format
   * @param {number} seconds - Duration in seconds
   * @returns {string} Formatted string
   */
  formatDuration(seconds) {
    if (seconds < 60) return `${seconds.toFixed(2)}s`;
    const minutes = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(0);
    if (minutes < 60) return `${minutes}m ${secs}s`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m ${secs}s`;
  }

  /**
   * Generate summary statistics
   * @returns {Object} Summary object
   */
  generateSummary() {
    const totalDuration = this.getDurationSeconds(this.startTime, this.endTime);
    const totalMB = this.totalBytes / (1024 * 1024);

    return {
      migration: {
        startTime: this.startTime?.toISOString(),
        endTime: this.endTime?.toISOString(),
        totalDuration: this.formatDuration(totalDuration),
        totalDurationSeconds: totalDuration,
      },
      records: {
        total: this.totalRecords,
        avgPerSecond:
          totalDuration > 0 ? (this.totalRecords / totalDuration).toFixed(2) : 0,
      },
      data: {
        totalBytes: this.totalBytes,
        totalMB: totalMB.toFixed(2),
        totalGB: (totalMB / 1024).toFixed(2),
        formatted: this.formatBytes(this.totalBytes),
        avgMBPerSecond: totalDuration > 0 ? (totalMB / totalDuration).toFixed(2) : 0,
        avgSecondsPerMB: totalMB > 0 ? (totalDuration / totalMB).toFixed(2) : 0,
      },
      performance: {
        avgSecondsPerRecord:
          this.totalRecords > 0
            ? (totalDuration / this.totalRecords).toFixed(6)
            : 0,
        avgRecordsPerSecond:
          totalDuration > 0 ? (this.totalRecords / totalDuration).toFixed(2) : 0,
        avgBytesPerRecord:
          this.totalRecords > 0
            ? Math.round(this.totalBytes / this.totalRecords)
            : 0,
      },
      reapers: {
        total: Object.keys(this.reapers).length,
        details: Object.entries(this.reapers).map(([index, data]) => ({
          reaperIndex: parseInt(index),
          duration: this.formatDuration(
            this.getDurationSeconds(data.startTime, data.endTime)
          ),
          durationSeconds: this.getDurationSeconds(data.startTime, data.endTime),
          records: data.records,
          dataSize: this.formatBytes(data.bytes),
          tables: data.tables.length,
        })),
      },
      tables: {
        total: Object.keys(this.tables).length,
        details: Object.entries(this.tables)
          .map(([key, data]) => ({
            table: data.tableName,
            reaperIndex: data.reaperIndex,
            duration: this.formatDuration(
              this.getDurationSeconds(data.startTime, data.endTime)
            ),
            durationSeconds: this.getDurationSeconds(data.startTime, data.endTime),
            records: data.records,
            dataSize: this.formatBytes(data.bytes),
            recordsPerSecond:
              this.getDurationSeconds(data.startTime, data.endTime) > 0
                ? (
                    data.records /
                    this.getDurationSeconds(data.startTime, data.endTime)
                  ).toFixed(2)
                : 0,
          }))
          .sort((a, b) => b.records - a.records), // Sort by records desc
      },
      errors: {
        total: this.errors.length,
        details: this.errors,
      },
    };
  }

  /**
   * Generate and save report to file
   * @param {string} outputPath - Path to save report
   */
  async saveReport(outputPath = './migration-report.json') {
    const summary = this.generateSummary();

    // Save JSON report
    await fs.writeFile(outputPath, JSON.stringify(summary, null, 2));

    // Also save human-readable text report
    const textReport = this.generateTextReport(summary);
    const textPath = outputPath.replace('.json', '.txt');
    await fs.writeFile(textPath, textReport);

    return { jsonPath: outputPath, textPath };
  }

  /**
   * Generate human-readable text report
   * @param {Object} summary - Summary object
   * @returns {string} Text report
   */
  generateTextReport(summary) {
    const lines = [];

    lines.push('═'.repeat(80));
    lines.push('MIGRATION REPORT');
    lines.push('═'.repeat(80));
    lines.push('');

    // Migration Summary
    lines.push('MIGRATION SUMMARY');
    lines.push('─'.repeat(80));
    lines.push(`Start Time:       ${summary.migration.startTime}`);
    lines.push(`End Time:         ${summary.migration.endTime}`);
    lines.push(`Total Duration:   ${summary.migration.totalDuration}`);
    lines.push('');

    // Records Summary
    lines.push('RECORDS');
    lines.push('─'.repeat(80));
    lines.push(
      `Total Records:           ${summary.records.total.toLocaleString()}`
    );
    lines.push(
      `Avg Records/Second:      ${summary.records.avgPerSecond.toLocaleString()}`
    );
    lines.push(
      `Avg Seconds/Record:      ${summary.performance.avgSecondsPerRecord}`
    );
    lines.push('');

    // Data Summary
    lines.push('DATA SIZE');
    lines.push('─'.repeat(80));
    lines.push(`Total Size:              ${summary.data.formatted}`);
    lines.push(`Total MB:                ${summary.data.totalMB} MB`);
    lines.push(`Total GB:                ${summary.data.totalGB} GB`);
    lines.push(`Avg MB/Second:           ${summary.data.avgMBPerSecond} MB/s`);
    lines.push(`Avg Seconds/MB:          ${summary.data.avgSecondsPerMB} s/MB`);
    lines.push(`Avg Bytes/Record:        ${summary.performance.avgBytesPerRecord}`);
    lines.push('');

    // Reapers Summary
    lines.push('REAPERS');
    lines.push('─'.repeat(80));
    lines.push(`Total Reapers:           ${summary.reapers.total}`);
    lines.push('');
    summary.reapers.details.forEach((reaper) => {
      lines.push(`  Reaper #${reaper.reaperIndex}:`);
      lines.push(`    Duration:     ${reaper.duration}`);
      lines.push(`    Records:      ${reaper.records.toLocaleString()}`);
      lines.push(`    Data Size:    ${reaper.dataSize}`);
      lines.push(`    Tables:       ${reaper.tables}`);
      lines.push('');
    });

    // Top 10 Tables by Records
    lines.push('TOP 10 TABLES BY RECORDS');
    lines.push('─'.repeat(80));
    lines.push(
      'Table Name'.padEnd(40) +
        'Records'.padEnd(15) +
        'Duration'.padEnd(15) +
        'Rec/s'
    );
    lines.push('─'.repeat(80));
    summary.tables.details.slice(0, 10).forEach((table) => {
      lines.push(
        table.table.padEnd(40) +
          table.records.toLocaleString().padEnd(15) +
          table.duration.padEnd(15) +
          table.recordsPerSecond
      );
    });
    lines.push('');

    // Errors
    if (summary.errors.total > 0) {
      lines.push('ERRORS');
      lines.push('─'.repeat(80));
      lines.push(`Total Errors:            ${summary.errors.total}`);
      summary.errors.details.forEach((error) => {
        lines.push(`  [${error.timestamp}] ${error.context}: ${error.message}`);
      });
      lines.push('');
    }

    lines.push('═'.repeat(80));
    lines.push(`Report generated at: ${new Date().toISOString()}`);
    lines.push('═'.repeat(80));

    return lines.join('\n');
  }
}

// Singleton instance
const reportTracker = new MigrationReportTracker();

module.exports = reportTracker;
