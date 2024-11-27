# Self-Hosted Indexers (Docker Configuration)

This section provides an alternative Docker-based approach for deploying **Subsquid indexers** used in the Hydration Data Lake. The setup utilizes Docker Compose to run the following components:

1. **Processor Application** (Node.js): Processes blockchain data and applies database migrations.
2. **API Application** (Node.js): Exposes API endpoints for querying processed data.
3. **Database** (PostgreSQL): Stores data processed by the indexers.

---

:book: [Liquidity-Pools Indexer Documentation](../indexers/liquidity-pools/README.md).

:book: [Storage-Dictionary Indexer Documentation](../indexers/storage-dictionary/README.md).

---

## Deployment Workflow

The containers **must be started in the following order**:

1. **Database (PostgreSQL)**: Initializes storage.
2. **Processor Application**: Applies database migrations and starts processing data.
3. **API Application**: Runs its own database migrations and exposes an API for querying processed data.

### ⚠️ Critical Startup Requirement

The **API Application** must start **after** the **Processor Application**, with some delay to ensure:

- Database migrations by the Processor are completed before the API starts.
- The API can run its own migrations, which depend on the Processor-created tables.

---

## Supported Indexers

### 1. **Liquidity-Pools Indexer**

- Processes blockchain liquidity pools data.
- Supports two modes:
  1. **RPC-Based Mode**: Fetches storage data directly via RPC calls.
  2. **Dictionary-Based Mode**: Uses the Storage-Dictionary Indexer as a pre-indexed data source for improved performance.

### 2. **Storage-Dictionary Indexer**

- Provides pre-indexed blockchain storage data for other indexers.

---

## Usage Guidelines

### Liquidity-Pools Indexer

- **Do not run the Liquidity-Pools Indexer and Storage-Dictionary Indexer in parallel**:
  - Liquidity-Pools Indexer depends on the Storage-Dictionary being fully indexed.
  - Parallel execution is inefficient because the Liquidity-Pools Indexer may process blocks faster than the Storage-Dictionary can index them.
- **Use a single instance of the Storage-Dictionary Indexer** as a shared data source for multiple Liquidity-Pools Indexer instances:
  - Reduces RPC load and improves performance.

---

## Running with Docker Compose

### Directory Structure

Ensure the following structure:

```
hydration-data-lake/
├── indexers/
│   ├── liquidity-pools/
│   └── storage-dictionary/
└── self-hosted/
    ├── liquidity-pools.docker-compose.yml
    └──  storage-dictionary.docker-compose.yml
```

### Instructions

1. Navigate to the `self-hosted` directory:
   ```bash
   cd self-hosted
   ```
2. Start the Storage-Dictionary Indexer (if required):

   ```bash
   docker compose -f storage-dictionary.docker-compose.yml up
   ```

3. Start the Liquidity-Pools Indexer:
   ```bash
   docker compose -f liquidity-pools.docker-compose.yml up
   ```
