
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS location_pings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    courier_id UUID NOT NULL,
    parcel_id UUID,
    location GEOGRAPHY(POINT, 4326) NOT NULL,
    speed NUMERIC,
    heading NUMERIC,
    accuracy NUMERIC,
    recorded_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_location_pings_courier_time
ON location_pings (courier_id, recorded_at DESC);

CREATE TABLE IF NOT EXISTS delivery_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parcel_id UUID NOT NULL,
    courier_id UUID,
    event_type VARCHAR(50),
    notes TEXT,
    location GEOGRAPHY(POINT, 4326),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS geofences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    zone GEOGRAPHY(POLYGON, 4326) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
