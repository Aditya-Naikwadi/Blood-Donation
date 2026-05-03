# Deployment Runbook

This guide covers the deployment of the Blood Donation Application to production using 100% free-tier services.

## Architecture Map
- **Frontend**: Vercel (Web/Admin)
- **Node.js Services**: Railway.app (Auth/Request)
- **Go Services**: Render.com (Donor/Match)
- **PostgreSQL**: Supabase
- **MongoDB**: Atlas
- **Redis/Kafka**: Upstash
- **Elasticsearch**: Oracle Cloud VM

## Deployment Steps

### Phase 1: Database & Messaging
1. Setup databases using [DATABASE_SETUP.md](./DATABASE_SETUP.md).
2. Note down all connection strings for the next phase.

### Phase 2: Backend Services
1. **Railway**:
   - Connect your GitHub repo.
   - Deploy `services/auth-service` and `services/request-service`.
   - Add required variables: `DATABASE_URL`, `REDIS_URL`, `MONGODB_URI`, `KAFKA_BROKERS`.
2. **Render**:
   - Connect GitHub.
   - Deploy `services/donor-service` and `services/match-engine`.
   - Use the `render.yaml` blueprint.

### Phase 3: Frontend Apps
1. **Vercel**:
   - Import the `apps/web` and `apps/admin` folders.
   - Add environment variables: `NEXT_PUBLIC_API_URL` (your Railway/Render public URL).
   - Vercel will automatically detect `vercel.json` for rewrites.

### Phase 4: Cloudflare (Optional but Recommended)
1. Point your domain to Cloudflare nameservers.
2. Create CNAME records for your Vercel and Railway endpoints.
3. Enable "Full (Strict)" SSL.
4. Add a Page Rule to bypass cache for `/api/v1/*`.

## Monitoring
- Check **Grafana** (local) or service-specific dashboards (Railway/Render) for health status.
- Use **Sentry** (free tier) for error tracking.
