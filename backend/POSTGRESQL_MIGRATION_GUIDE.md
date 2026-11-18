# AlgoVis Database Migration Guide: SQLite to PostgreSQL

This document details the architectural migration of the **AlgoVis** backend from SQLite to **PostgreSQL**.

---

## 1. Why PostgreSQL?

1. **Enterprise Concurrency**: SQLite employs database-level file locks on write operations, which restricts multi-user concurrent interview sessions and simultaneous activity logging. PostgreSQL provides Multi-Version Concurrency Control (MVCC) with row-level locking.
2. **Strict Foreign-Key Integrity**: PostgreSQL natively enforces referential integrity constraints and cascading deletions across all relational models.
3. **Optimized Search**: Full-text searching and case-insensitive querying (`mode: 'insensitive'`) provide predictable matching across algorithm names, categories, and tags.
4. **Connection Pooling & Scalability**: Centralized Prisma Client connection pooling enables smooth scaling in production environments.

---

## 2. Architecture & Data Model Inventory

All **17 models** have been preserved and mapped to PostgreSQL:

| Model | Description | Relations & Constraints |
|---|---|---|
| `User` | User profiles, authentication, statistics | PK: `id` (UUID), Unique: `email`, `username` |
| `UserEvent` | Timestamped user events (lessons, visualizer, interviews) | FK: `userId` -> `User`, Index: `[userId, timestamp]` |
| `UserAchievement` | Unlocked user badges | FK: `userId`, `achievementId`, Unique: `[userId, achievementId]` |
| `UserActivity` | Detailed chronological activity logs | FK: `userId` -> `User`, Index: `[userId, timestamp]` |
| `UserTopicCompletion` | Tracks topic completion | FK: `userId`, Unique: `[userId, topicId]` |
| `UserProblemCompletion` | Tracks problem solutions and scores | FK: `userId`, Unique: `[userId, problemId]` |
| `UserStreak` | Daily streaks and monthly activity days | Unique: `userId` |
| `Progress` | Per-algorithm completion progress and scores | FK: `userId`, Unique: `[userId, algorithmId]` |
| `Algorithm` | Algorithm metadata, complexity, notes | PK: `id`, Unique: `slug` |
| `Question` | Practice questions, solutions, hints | PK: `id` (UUID) |
| `RoadmapNode` | Curriculum milestone nodes | PK: `id`, Order: `recommendedOrder` |
| `Achievement` | Badges and XP definitions | PK: `id` (UUID) |
| `PracticeAttempt` | User scores and completion times | FK: `userId` (nullable) |
| `InterviewSession` | AI Interview sessions, turns, timers | FK: `userId` (nullable), Index: `[userId, createdAt]` |
| `InterviewMessage` | Chronological turns and transcripts | FK: `sessionId` (CASCADE), Index: `[sessionId, sequenceNumber]` |
| `InterviewEvaluation` | 10-point semantic dimension evaluations | FK: `sessionId` (CASCADE), Index: `[sessionId, dimension]` |
| `InterviewReport` | Synthesized AI performance reports | FK: `sessionId` (CASCADE), Unique: `sessionId` |

---

## 3. PostgreSQL Database Setup

### Option A: Docker Compose (Recommended)
From the project root:
```bash
docker compose up -d
```
This launches a PostgreSQL 16 Alpine container with persistent storage mapped to volume `algovis_postgres_data`.

### Option B: Local PostgreSQL Installation
Connect with `psql` and ensure the database exists:
```sql
CREATE DATABASE algovis;
```

---

## 4. Environment Configuration

In `backend/.env`:
```env
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/algovis?schema=public"
PORT=5000
JWT_SECRET="super-secret-jwt-key"
GEMINI_API_KEY="your-google-ai-studio-api-key"
GEMINI_MODEL="gemini-3.8-flash"
```

> **Note on Special Characters**: If your database password contains characters like `@`, encode them as percent-encoded values (e.g. `Karan@2004` becomes `Karan%402004`).

---

## 5. Running Migrations & Seeding

Navigate to `backend/`:

1. **Deploy Migrations to PostgreSQL**:
   ```bash
   npm run prisma:migrate
   ```
   *Executes `prisma/migrations/20261118000000_init_postgresql/migration.sql` creating all 17 tables and indexes.*

2. **Migrate Historical Data from SQLite**:
   ```bash
   npm run db:migrate-data
   ```
   *Transfers all records from `prisma/sqlite_dump.json` into PostgreSQL in topological dependency order using idempotent upserts.*

3. **Seed Starter Content**:
   ```bash
   npm run db:seed
   ```
   *Populates initial algorithm definitions, questions, achievements, and test accounts.*

4. **Regenerate Prisma Client**:
   ```bash
   npm run prisma:generate
   ```

---

## 6. Preserved SQLite Artifacts

The legacy SQLite database and migrations have been safely archived and are retained for reference:
- `backend/prisma/dev.db.backup`: Binary backup of the original SQLite database.
- `backend/prisma/sqlite_dump.json`: Complete JSON dump of all 178 records across all 17 tables.
- `backend/prisma/migrations_sqlite_archive/`: Archived SQLite migrations.
