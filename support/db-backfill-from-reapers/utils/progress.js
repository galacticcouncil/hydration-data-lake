/**
 * Progress tracking utilities for resumable migrations
 */
const fs = require('fs').promises;
const { log } = require('./logger');
const config = require('../config');

/**
 * Load progress from file
 * @returns {Promise<Object>} Progress object with completedReapers, currentReaper, and completedTables
 */
async function loadProgress() {
  try {
    const data = await fs.readFile(config.PROGRESS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist or is invalid, return empty progress
    return { completedReapers: [], currentReaper: null, completedTables: {} };
  }
}

/**
 * Save progress to file
 * @param {Object} progress - Progress object to save
 */
async function saveProgress(progress) {
  try {
    await fs.writeFile(
      config.PROGRESS_FILE,
      JSON.stringify(progress, null, 2),
      'utf-8'
    );
  } catch (error) {
    log(`Warning: Failed to save progress: ${error.message}`, 'WARN');
  }
}

/**
 * Clear progress file
 */
async function clearProgress() {
  try {
    await fs.unlink(config.PROGRESS_FILE);
  } catch (error) {
    // File doesn't exist, ignore
  }
}

module.exports = {
  loadProgress,
  saveProgress,
  clearProgress,
};
