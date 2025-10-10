# 🩺 Hydration Data Lake API Health Checker

A NestJS-based monitoring application for validating and tracking the health of Hydration blockchain indexers. This service continuously monitors on-chain events, compares them with indexed data, and sends notifications when discrepancies are detected.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Monitoring](#monitoring)
- [Development](#development)
- [Testing](#testing)
- [Docker Deployment](#docker-deployment)
- [License](#license)

## Overview

The API Health Checker validates the accuracy and timeliness of the Hydration blockchain indexers by:

1. Subscribing to on-chain events via WebSocket RPC
2. Querying the indexer's GraphQL API for corresponding indexed data
3. Comparing on-chain data with indexed data
4. Tracking health scores for different event types
5. Sending Discord notifications when issues are detected
6. Providing REST endpoints for health status queries

## Features

### ✅ Event Monitoring

- **Swap Events (`Broadcast_Swapped3`)**: Validates swap transactions including inputs, outputs, swapper, and filler data
- **Money Market Events**: Monitors Supply and Borrow operations in the Aave-based money market
- **Block Processing**: Tracks the difference between on-chain and indexer block heights

### 📊 Health Tracking

- Maintains health scores for each monitored event type
- Stores state in Redis using redis-om
- Implements retry logic for delayed indexing
- Configurable thresholds for job attempts

### 🔔 Notifications

- Discord integration for real-time alerts
- Rich embed messages with current status metrics
- Configurable notification triggers
- Visual indicators for score changes

### 🎯 Queue Management

- Bull queue system for job processing
- Bull Board web UI for queue monitoring (`/queues` endpoint)
- Scheduled jobs for periodic health checks
- Background processing with retry mechanisms

## Architecture

### Core Modules

```
src/
├── modules/
│   ├── healthCheckCore/          # Core health checking logic
│   ├── indexerApi/                # GraphQL client for indexer API
│   ├── apiGateway/                # REST API endpoints
│   ├── onChainEvents/             # On-chain event listeners
│   ├── notificationsDispatcher/   # Discord notification service
│   ├── queue/                     # Bull queue management
│   └── platformBootstrap/         # Application lifecycle management
├── providers/
│   ├── polkadotApi.provider.ts   # Polkadot API connection
│   └── redisOmClient.provider.ts # Redis OM client
├── utils/
│   ├── commonUtils.ts
│   ├── cryptoUtils.ts
│   └── evmTools/                  # EVM log decoding utilities
└── types/                         # TypeScript type definitions
```

### Technology Stack

- **Framework**: NestJS 11
- **Blockchain**: Polkadot API / Polkadot-API (papi)
- **Database**: Redis (with redis-om for ORM)
- **Queue**: Bull (Redis-based queue)
- **GraphQL**: urql client
- **Notifications**: Discord.js
- **EVM**: ethers.js for EVM log decoding

## Prerequisites

- Node.js 20 or higher
- Redis Stack
- Access to:
  - Hydration blockchain RPC endpoint
  - Hydration indexer GraphQL API
  - Discord bot token (optional, for notifications)

## Installation

```bash
# Install dependencies
npm install

# Generate Polkadot API types (optional)
npm run papi-typegen

# Generate GraphQL types from indexer API
npm run indexer-api-codegen
```

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Application
APP_PORT=8081
NODE_ENV=development
APP_TERMINATED=false

# Redis Configuration
REDIS_HOST=localhost
REDIS_PASSWORD=password
REDIS_PORT=6379

# Blockchain
WSS_URL=wss://hydration-rpc.n.dwellir.com

# Indexer API
INDEXER_GRAPHQL_API_URL=https://galacticcouncil.squids.live/hydration-pools:unified-prod/api/graphql

# Discord Notifications (optional)
DISCORD_ALERTS_BOT_TOKEN=your_bot_token
DISCORD_ALERTS_SERVER=your_server_id
DISCORD_ALERTS_CHANEL=your_channel_id
```

### Additional Configuration

Health check thresholds and retry logic can be configured in the AppConfig service (see `src/config.module.ts`).

## Running the Application

### Development Mode

```bash
# Start Redis (using docker-compose)
npm run db-up

# Start application in watch mode
npm run start:dev

# Start with debug mode
npm run start:debug
```

### Production Mode

```bash
# Build the application
npm run build

# Start production server
npm run start:prod
```

The application will be available at `http://localhost:8081` (or your configured `APP_PORT`).

## API Endpoints

### Health Status Endpoint

```http
GET /indexer/status
```

Returns the current health status of the indexer:

```json
{
  "latestIndexerBlockHeight": 6789012,
  "latestOnChainBlockHeight": 6789015,
  "swappedEventsTrackingStatusScore": 5,
  "mmEventsTrackingStatusScore": 5
}
```

**Response Fields:**
- `latestIndexerBlockHeight`: Latest block processed by the indexer
- `latestOnChainBlockHeight`: Latest block on the chain
- `swappedEventsTrackingStatusScore`: Health score for swap events (0-5)
- `mmEventsTrackingStatusScore`: Health score for money market events (0-5)

### Queue Dashboard

```http
GET /queues
```

Access the Bull Board UI to monitor job queues, view job details, and manage queue operations.

## Monitoring

### Health Scores

Each monitored event type has a score ranging from 0 to 5:
- **5**: Perfect health, all recent checks passed
- **3-4**: Good health with occasional mismatches
- **1-2**: Degraded health, frequent issues detected
- **0**: Critical, multiple consecutive failures

### Discord Notifications

When enabled, the service sends Discord notifications when:
- Swap event validation fails or recovers
- Money market event validation fails or recovers
- Indexer falls behind in block processing

Notifications include:
- Current health scores
- Block height comparison
- Change indicators (warnings or improvements)
- Timestamp of the event

## Development

### Project Structure

- **Controllers**: Handle HTTP requests (in `src/modules/apiGateway/rest/`)
- **Services**: Business logic (in each module's `.service.ts` files)
- **Providers**: External service connections (in `src/providers/`)
- **Queue Jobs**: Background tasks (in `src/modules/queue/`)

### Code Generation

```bash
# Generate GraphQL types from indexer schema
npm run indexer-api-codegen

# Generate Polkadot API types
npm run papi-typegen
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Format code with Prettier
npm run format
```

## Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e

# Generate test coverage
npm run test:cov

# Debug tests
npm run test:debug
```

## Docker Deployment

### Build Docker Image

```bash
docker build -t hydration-health-checker .
```

### Run with Docker Compose

The included `docker-compose.yml` provides a Redis Stack instance:

```bash
docker-compose up -d
```

This starts Redis on port 6379 with password `password`.

### Multi-stage Build

The Dockerfile uses a multi-stage build:
1. **Builder stage**: Installs dependencies and compiles TypeScript
2. **Runner stage**: Creates a minimal production image

## How It Works

### Event Flow

1. **On-Chain Event Detection**: The `OnChainEventsService` subscribes to the Hydration blockchain and listens for relevant events (swaps, money market operations, new blocks)

2. **Job Queuing**: When an event is detected, a job is added to the Bull queue with event payload and metadata

3. **Event Validation**: The `HealthCheckCoreService` processes the job:
   - Queries the indexer GraphQL API for the corresponding data
   - Compares on-chain data with indexed data
   - Validates all fields match exactly

4. **Score Updates**: Based on validation results:
   - Success: Increment health score (max 5)
   - Failure: Decrement health score (min 0)
   - Retry: Reschedule job if under attempt threshold

5. **Notifications**: The `NotificationsDispatcherService` monitors score changes and sends Discord alerts when thresholds are crossed

### Retry Logic

- Jobs are retried up to `EVENT_CHECK_JOB_ATTEMPTS_NUMBER_THRESHOLD` times
- Useful for handling indexer lag (data not yet indexed)
- After threshold, job is marked as failed and score is decremented

## Troubleshooting

### Connection Issues

- **Redis connection failed**: Ensure Redis is running and credentials are correct
- **WebSocket connection failed**: Check `WSS_URL` and network connectivity
- **GraphQL API timeout**: Verify `INDEXER_GRAPHQL_API_URL` is accessible

### Performance

- Monitor queue length in Bull Board (`/queues`)
- Check Redis memory usage
- Review job processing times

### Debug Mode

Run with debug logging:

```bash
NODE_ENV=development npm run start:debug
```

## License

Apache-2.0

---

**Maintained by**: Galactic Council
**Project**: Hydration Data Lake
