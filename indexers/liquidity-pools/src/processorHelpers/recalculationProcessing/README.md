# Data Recalculation Scripts

## Overview

This folder contains scripts designed to recalculate previously aggregated data that may have been processed incorrectly. These scripts function similarly to database migrations, allowing you to correct historical data inconsistencies.

## Purpose

The logic in this folder is intended to:
- Fix wrongly aggregated data from previous processing runs
- Serve as a data migration tool for existing databases
- Provide a way to retroactively correct data without losing existing information

## Usage

⚠️ **Important**: These scripts should be executed as a separate processor on an already existing database that contains data.

### Prerequisites

- An existing database with previously processed data
- Appropriate database permissions for data modification
- Backup of your database (recommended before running any recalculation scripts)

### Execution

1. Ensure your database is properly backed up
2. Configure the processor to connect to your existing database
3. Run the recalculation scripts as a separate process
4. Verify the results before proceeding with normal operations

## Warning

⚠️ These scripts will modify existing data in your database. Always ensure you have a complete backup before running any recalculation processes.

## Support

If you encounter issues during the recalculation process, please ensure:
- Your database connection is properly configured
- You have sufficient permissions to modify the data
- The existing data structure matches the expected format

---

*Note: This is a data migration tool and should be used with caution in production environments.*