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

The containers **should be started in the following order**:

1. **Database (PostgreSQL)**: Initializes storage.
2. **Processor Application(s)**: Applies database migrations and starts processing data.
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

## Running with Docker Swarm

Prebuilt and published Docker images are available for deployment:

- **Liquidity Pools Indexer**: [ghcr.io/mckrava/liquidity-pools-indexer](https://ghcr.io/mckrava/liquidity-pools-indexer)
- **Storage Dictionary Indexer**: [ghcr.io/mckrava/storage-dictionary-indexer](https://ghcr.io/mckrava/storage-dictionary-indexer)

For details on environment variable configurations, refer to the documentation:

- [Liquidity Pools Documentation](../indexers/liquidity-pools/README.md#environment-variables)
- [Storage Dictionary Documentation](../indexers/storage-dictionary/README.md#environment-variables)

### Stack Files to Run

- **Liquidity Pools Stack**: [liquidity-pools.stack.yml](liquidity-pools.stack.yml)

  - Runs all necessary components for the Liquidity Pools Indexer.
  - **Exclusion**: Does not run the Storage Dictionary Indexer.

- **Storage Dictionary Mono-Processor Stack**: [storage-dictionary-mono-processor.stack.yml](storage-dictionary-mono-processor.stack.yml)

  - Establishes a single indexer with one processor app for all pool types.
  - Provides a unified API endpoint usable across all `STORAGE_DICTIONARY_<pool_kind>_URL` environment variables.
  - **Efficiency**: Less efficient in indexing time.

- **Storage Dictionary Multi-Processor Stack**: [storage-dictionary-multiprocessor.stack.yml](storage-dictionary-multiprocessor.stack.yml)
  - Creates an infrastructure with one indexer and two processor apps per liquidity pool type, leading to:
    - **4 Indexers**: Distinct data gathering per pool type.
    - **4 Databases**: Unique data storage for each indexer.
    - **8 Processor Apps**: Each app manages its own blocks range.
    - **4 API URLs**: Separate endpoints for enhanced access control.
  - Shared codebase across indexers ensuring identical API schema.
  - Individual data handling:
    - Each processor manages its assigned blocks range into the indexer's database.
    - One processor handles the latest block chunk and new blocks.
  - **Efficiency Advantage**: Optimizes indexing by parallelizing data processing across multiple handlers.
