# Store Analytics Dashboard
A real-time e-commerce analytics dashboard designed to process and visualize requests.

## Setup Instructions

1. **Prerequisites**
   - Node.js (v18+)
   - PostgreSQL running locally
   - Redis server running locally

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Duplicate .env.example into .env and set your DATABASE_URL
   npx prisma db push --force-reset
   
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Generating Activity**
   - **Method A (GUI):** Open the Dashboard at `http://localhost:3002` and click "Create Account".
   - **Method B (CLI):** Spawn new tenants pragmatically via the console utility:
     ```bash
     cd backend
     npx ts-node scripts/create-store.ts --name="store_name" --password="password123"
     ```
   - **Live Seeder**: Blast the API with 1,000 parallel events attached to your newly created tenant:
     ```bash
     curl -X POST http://localhost:3001/api/v1/events/seed
     ```
   - Add a new data using
      ```bash
      curl -X POST http://localhost:3001/api/v1/events \
        -H "Content-Type: application/json" \
        -d '{"store_id":"YOUR_STORE_ID_HERE","event_type":"purchase","data":{"product_id":"prod_01","amount":9.99}}'
      ```
   - **Backfill Historical Data**: To see the "Last 7 Days" filtering in action on the dashboard, run the specialized history seeder which directly injects back-dated payloads into PostgreSQL:
     ```bash
     cd backend
     npx ts-node scripts/seed-history.ts --store="YOUR_STORE_ID_HERE"
     ```

## Key API Endpoints
- `POST /api/v1/events` - Ingests a new analytics event.
- `GET /api/v1/analytics/overview?store_id=YOUR_STORE_ID_HERE` - Returns heavily cached live metrics (Revenue, CTR, Output).
- `GET /api/v1/analytics/top-products?store_id=YOUR_STORE_ID_HERE` - Returns a sorted map of fastest-selling products for the store.
- `GET /api/v1/analytics/recent-activity?store_id=YOUR_STORE_ID_HERE` - Returns the real-time active news feed of the last 50 transactions.
- `POST /api/v1/auth/register` - Creates a new account.

## Architecture Decisions

### Data Aggregation Strategy
- **Decision:** Utilized Redis Hashes (`HINCRBY`) to tally daily metrics instantaneously.
- **Why:** Writing 10k+ rows per minute directly into PostgreSQL would lock tables and bottleneck the system. Redis handles O(1) increments seamlessly, while PostgreSQL safely acts as our cold-storage source of truth.
- **Trade-offs:** We gained extreme read/write throughput and sub-500ms latency on dashboard requests. The minor sacrifice is that if the Node process crashes mid-interval, the 5-second buffer of raw events in memory may go unsynced to Postgres(though Redis counters will still hold the accurate totals).

### Real-time vs. Batch Processing
- **Decision:** Hybrid approach. Real-time updates (metrics) are handled natively in Redis, while raw data persistence is handled via an asynchronous batch buffer (`createMany` at 5-second intervals).
- **Why:** The dashboard requires metrics instantly, but building complex OLAP models in a SQL engine strictly for real-time reads is terribly slow. Using Redis for hot-path metrics and Postgres for batch cold-path historical filtering delivers the best of both architectures.
- **Trade-offs:** Historical "Date Range" queries are slightly slower because they must bypass Redis and execute raw Prisma SQL aggregations on the cold database table.

### Frontend Data Fetching
- **Decision:** Leveraged Stale-While-Revalidate with a 2.5-second polling interval in Next.js 15, rather than WebSockets.
- **Why:** WebSockets can become heavily resource-intensive and difficult to horizontally scale with load balancers (requiring sticky sessions or Redis Pub/Sub adapters). SWR mimics a live data feed natively over stateless HTTP interfaces while preserving browser-level caching.

### Performance Optimizations
- **In-Memory Buffering:** Reduced PostgreSQL connection pooling overhead by aggregating individual API event hits into a single `createMany` transaction every 5 seconds.
- **O(log(N)) Window Tapering:** Tracking "Active Users" natively purges stale event timestamps utilizing Redis `ZREMRANGEBYSCORE`, offloading garbage collection from Node.js to C-level Redis abstractions.
- **Client-side Component Isolation:** Used React `"use client"` scopes in Next.js exclusively on the chart components, allowing layout components (like the shell) to remain statically hydrated.

## Known Limitations
- **Horizontal Scaling Constraints:** The current events processing relies on a Node.js `setInterval` memory buffer. 
- Store count feature could've been enhanced

## What I'd Improve With More Time
- **Dockerise:** Containerize the NestJS, Next.js, Redis and Postgres databases into a single orchestrator environment for simpler bootup.
- Implementation of Kafka

## Time Spent
Approximately 4 hours.
