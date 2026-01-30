#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const PROGRESS_FILE = process.env.PROGRESS_FILE || './migration-progress.json';

console.log('=== Migration Progress Checker ===\n');

try {
  if (!fs.existsSync(PROGRESS_FILE)) {
    console.log('❌ No progress file found at:', PROGRESS_FILE);
    console.log('This means no migration has been started or progress was cleared.\n');
    process.exit(0);
  }

  const data = fs.readFileSync(PROGRESS_FILE, 'utf-8');
  const progress = JSON.parse(data);

  console.log('✓ Progress file found at:', PROGRESS_FILE);
  console.log('File size:', fs.statSync(PROGRESS_FILE).size, 'bytes\n');

  console.log('Completed Reapers:', progress.completedReapers.length);
  if (progress.completedReapers.length > 0) {
    console.log('  Indices:', progress.completedReapers.join(', '));
  }

  console.log('\nCurrent Reaper:', progress.currentReaper || 'none');

  console.log('\nTables in Progress:', Object.keys(progress.completedTables).length);

  if (Object.keys(progress.completedTables).length > 0) {
    console.log('\nTable Progress Details:');
    const sortedKeys = Object.keys(progress.completedTables).sort();
    sortedKeys.forEach(key => {
      console.log(`  - ${key}: ${progress.completedTables[key].toLocaleString()} rows processed`);
    });
  }

  console.log('\n=== To Resume Migration ===');
  console.log('Run: RESUME_MIGRATION=true npm start');
  console.log('\n=== To Start Fresh ===');
  console.log(`Run: rm ${PROGRESS_FILE} && npm start`);

} catch (error) {
  console.error('❌ Error reading progress file:', error.message);
  process.exit(1);
}
