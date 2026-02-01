/**
 * Global progress tracking for multi-reaper migration
 */
const { log } = require('./logger');

class GlobalProgressTracker {
  constructor() {
    this.totalReapers = 0;
    this.completedReapers = 0;
    this.currentReaperIndex = null;
    this.totalTables = 0;
    this.completedTables = 0;
    this.currentTableName = null;
    this.lastLogTime = Date.now();
    this.logIntervalMs = 5 * 60 * 1000; // 5 minutes
    this.startTime = Date.now();
  }

  /**
   * Initialize tracker with reaper count
   */
  setTotalReapers(count) {
    this.totalReapers = count;
  }

  /**
   * Set total number of tables across all reapers
   */
  setTotalTables(count) {
    this.totalTables = count;
  }

  /**
   * Start processing a new reaper
   */
  startReaper(reaperIndex, tableCount) {
    this.currentReaperIndex = reaperIndex;
    this.totalTables += tableCount;
  }

  /**
   * Mark a reaper as completed
   */
  completeReaper() {
    this.completedReapers++;
    this.currentReaperIndex = null;
  }

  /**
   * Start processing a new table
   */
  startTable(tableName) {
    this.currentTableName = tableName;
  }

  /**
   * Mark a table as completed
   */
  completeTable() {
    this.completedTables++;
    this.currentTableName = null;
    this.maybeLogProgress();
  }

  /**
   * Force log progress regardless of time interval
   */
  forceLogProgress() {
    this._logProgress();
  }

  /**
   * Log progress if enough time has passed
   */
  maybeLogProgress() {
    const now = Date.now();
    if (now - this.lastLogTime >= this.logIntervalMs) {
      this._logProgress();
      this.lastLogTime = now;
    }
  }

  /**
   * Calculate overall completion percentage
   */
  getOverallPercentage() {
    if (this.totalTables === 0) return 0;
    return ((this.completedTables / this.totalTables) * 100).toFixed(2);
  }

  /**
   * Get elapsed time in human-readable format
   */
  getElapsedTime() {
    const elapsedMs = Date.now() - this.startTime;
    const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  /**
   * Estimate time remaining based on current progress
   */
  getEstimatedTimeRemaining() {
    if (this.completedTables === 0) return 'Calculating...';
    const elapsedMs = Date.now() - this.startTime;
    const avgTimePerTable = elapsedMs / this.completedTables;
    const remainingTables = this.totalTables - this.completedTables;
    const remainingMs = avgTimePerTable * remainingTables;

    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    return `~${hours}h ${minutes}m`;
  }

  /**
   * Internal method to log progress
   */
  _logProgress() {
    log('\n========================================');
    log('📊 GLOBAL MIGRATION PROGRESS');
    log('========================================');
    log(
      `Reapers: ${this.completedReapers}/${this.totalReapers} completed`
    );
    if (this.currentReaperIndex !== null) {
      log(`  → Currently processing: Reaper #${this.currentReaperIndex}`);
    }
    log(
      `Tables: ${this.completedTables}/${this.totalTables} completed (${this.getOverallPercentage()}%)`
    );
    if (this.currentTableName) {
      log(`  → Currently processing: ${this.currentTableName}`);
    }
    log(`Elapsed time: ${this.getElapsedTime()}`);
    if (this.completedTables > 0) {
      log(`Estimated time remaining: ${this.getEstimatedTimeRemaining()}`);
    }
    log('========================================\n');
  }
}

// Singleton instance
const globalProgressTracker = new GlobalProgressTracker();

module.exports = globalProgressTracker;