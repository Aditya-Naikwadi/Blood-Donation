# Database Setup Guide (Production)

Follow these steps to configure your production databases using free-tier services.

## 1. PostgreSQL (Supabase)
1. Create a new project on [Supabase](https://supabase.com/).
2. Go to **Project Settings** > **Database**.
3. Copy the **Connection string** (URI mode).
4. Run migrations from your local machine:
   ```bash
   cd services/auth-service
   DATABASE_URL="your_supabase_url" npx prisma migrate deploy
   ```
5. In the Supabase SQL Editor, enable PostGIS:
   ```sql
   CREATE EXTENSION postgis;
   ```

## 2. Upstash (Redis & Kafka)
1. Create a Redis database on [Upstash](https://upstash.com/).
2. Create a Kafka cluster and the following topics:
   - `donor.registered`
   - `request.created`
   - `match.found`
   - `donor.accepted`
   - `donation.completed`
3. Copy the connection strings and add them to your environment variables.
