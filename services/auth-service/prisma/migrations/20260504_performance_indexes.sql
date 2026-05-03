-- Optimise user search by blood type and availability
CREATE INDEX IF NOT EXISTS idx_users_blood_availability 
ON "User" ("bloodType", "isAvailable", "lastDonationDate");

-- Optimise inventory lookups for hospitals
CREATE INDEX IF NOT EXISTS idx_inventory_bank_type 
ON "BloodInventory" ("bloodBank", "bloodType");

-- Optimise donation history retrieval
CREATE INDEX IF NOT EXISTS idx_history_donor_date 
ON "DonationHistory" ("donorId", "donatedAt" DESC);

-- Enable PostGIS for geo-spatial queries if not already present
CREATE EXTENSION IF NOT EXISTS postgis;
