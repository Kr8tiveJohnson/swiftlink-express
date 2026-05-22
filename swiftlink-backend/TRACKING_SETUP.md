
# SwiftLink Real-Time Tracking Upgrade

## Features Added
- Redis live tracking
- Socket.io realtime updates
- Google Maps ETA
- PostGIS migration
- Delivery events
- Geofence structure
- Courier online/offline detection
- Tracking APIs

## Install Packages

npm install ioredis socket.io axios pg pg-hstore

## Run SQL Migration

tracking/sql/tracking_tables.sql

## Add To .env

REDIS_URL=redis://localhost:6379
GOOGLE_MAPS_API_KEY=YOUR_KEY

## Smart Mobile Ping Rules

- Every 10 seconds during active delivery
- Every 60 seconds while idle
- Stop pinging when offline

## Next Steps

1. Install PostgreSQL + PostGIS
2. Run migration SQL
3. Start Redis server
4. Install dependencies
5. Start backend
6. Connect mobile app
7. Connect admin dashboard with Socket.io

