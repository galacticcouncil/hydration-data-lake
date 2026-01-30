# Project Structure

This document describes the modular architecture of the DB Backfill application.

## Directory Layout

```
db-backfill-from-reapers/
├── index.js                  # Main application entry point
├── config.js                 # Environment configuration
├── package.json              # Dependencies and scripts
├── Dockerfile                # Docker build configuration
├── docker-compose.yml        # Docker Swarm stack configuration
├── reapers-list.json         # Reaper configurations
├── check-progress.js         # Progress inspection utility
│
├── utils/                    # Utility modules
│   ├── logger.js            # Logging functionality
│   └── progress.js          # Progress tracking (save/load/clear)
│
├── database/                 # Database operations
│   ├── schema.js            # Schema discovery and analysis
│   └── migration.js         # Table migration logic
│
└── services/                 # Business logic services
    └── reaper.js            # Reaper processing orchestration
```

## Module Responsibilities

### `index.js` (Main Entry Point)
- Application initialization
- Command-line argument and environment validation
- Orchestrates the overall migration flow
- Error handling and graceful shutdown

**Key Functions:**
- `main()` - Application entry point

---

### `config.js` (Configuration)
- Centralizes all environment variable access
- Provides default values
- Type conversions (e.g., string to number)

**Exports:**
- `HARVESTER_DB_URL` - Harvester database connection
- `SCHEMA_NAME` - Database schema to migrate
- `REAPERS_LIST_JSON` - Optional JSON string of reapers
- `REAPERS_LIST_FILE` - Path to reapers list file
- `DISABLE_FK_CHECKS` - Foreign key check toggle
- `BATCH_SIZE` - Rows per batch
- `BULK_INSERT_SIZE` - Rows per INSERT statement
- `PROGRESS_FILE` - Progress file path
- `RESUME_MIGRATION` - Resume mode toggle

---

### `utils/logger.js` (Logging)
- Timestamp-prefixed logging
- Log level support (INFO, WARN, ERROR)

**Exports:**
- `log(message, level)` - Log a message with timestamp

---

### `utils/progress.js` (Progress Tracking)
- Save/load migration progress to JSON file
- Enables resumability after crashes

**Exports:**
- `loadProgress()` - Load progress from file
- `saveProgress(progress)` - Save progress to file
- `clearProgress()` - Delete progress file

**Progress Object Structure:**
```javascript
{
  completedReapers: [1, 2, 3],        // Completed reaper indices
  currentReaper: 4,                   // Currently processing reaper
  completedTables: {                  // Per-table row offsets
    "1_account": 50000,
    "1_event": 1000000
  }
}
```

---

### `database/schema.js` (Schema Discovery)
- Discover tables, columns, and foreign keys from database metadata
- Topological sorting of tables by dependencies

**Exports:**
- `getTables(client)` - Get all tables in schema
- `getTableColumns(client, tableName)` - Get column names for table
- `hasIdColumn(client, tableName)` - Check if table has 'id' column
- `getTableDependencies(client)` - Get foreign key relationships
- `sortTablesByDependencies(tables, dependencies)` - Topological sort

---

### `database/migration.js` (Migration Logic)
- Cursor-based streaming for memory efficiency
- Batch processing with bulk INSERTs
- Conflict resolution (ON CONFLICT DO UPDATE)
- Progress tracking at batch level
- Fallback to row-by-row insertion on errors

**Exports:**
- `migrateTable(harvesterClient, reaperClient, tableName, reaperIndex, progress)` - Migrate single table

**Internal Functions:**
- `buildInsertQueryTemplate()` - Create parameterized INSERT query
- `processBatch()` - Process batch with bulk inserts
- `processChunkRowByRow()` - Fallback for failed batches

---

### `services/reaper.js` (Reaper Processing)
- Orchestrates migration of all tables from one reaper
- Manages database connections
- Handles foreign key check toggling
- Updates progress tracking

**Exports:**
- `processReaper(harvesterClient, reaper, progress)` - Process one reaper

**Flow:**
1. Connect to reaper database
2. Disable foreign key checks (if configured)
3. Discover and sort tables
4. Migrate each table sequentially
5. Re-enable foreign key checks
6. Mark reaper as completed

---

## Data Flow

```
index.js
   ├─> Load configuration (config.js)
   ├─> Load/initialize progress (utils/progress.js)
   ├─> Load reapers list
   └─> For each reaper:
        └─> services/reaper.js
             ├─> Discover tables (database/schema.js)
             ├─> Sort by dependencies (database/schema.js)
             └─> For each table:
                  └─> database/migration.js
                       ├─> Stream rows with cursor
                       ├─> Bulk INSERT batches
                       └─> Update progress (utils/progress.js)
```

## Benefits of This Structure

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Testability**: Individual modules can be unit tested in isolation
3. **Maintainability**: Easy to locate and modify specific functionality
4. **Reusability**: Modules can be reused in other projects
5. **Readability**: index.js is now ~115 lines vs. 477 lines before
6. **Extensibility**: Easy to add new features (e.g., new migration strategies)

## Adding New Features

### Example: Add Custom Migration Strategy

1. Create new function in `database/migration.js`:
   ```javascript
   async function migrateTableWithCopy(client, tableName) { ... }
   ```

2. Update `services/reaper.js` to use it:
   ```javascript
   if (useCustomStrategy) {
     await migrateTableWithCopy(...);
   } else {
     await migrateTable(...);
   }
   ```

3. Add configuration flag in `config.js`:
   ```javascript
   USE_COPY_STRATEGY: process.env.USE_COPY_STRATEGY === 'true'
   ```

No changes needed to other modules!

## Maintenance Guidelines

1. **Keep modules focused**: Don't mix responsibilities
2. **Document exports**: Add JSDoc comments to all exported functions
3. **Handle errors gracefully**: Log and propagate errors appropriately
4. **Avoid circular dependencies**: Use dependency injection when needed
5. **Test in isolation**: Each module should have unit tests
