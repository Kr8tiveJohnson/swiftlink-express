# SwiftLink Express Backend

This project is the Node/Express backend for SwiftLink Express. It serves the frontend files from `public/` and stores admin, shipment, contact, and settings data in a local JSON database.

## Deployment

### Recommended platforms
- **Render** — best for a full Node backend with persistent disk or external database.
- **Railway** — good for Node apps and easy GitHub deployments.
- **Fly.io** — works well with Docker and persistent volumes.

### Why this matters
This app currently stores data in a local file at `data/db.json`.
For data to remain permanent after deploys, the host must provide a persistent disk or volume.

### Render setup
1. Push this repo to GitHub.
2. Create a new Web Service in Render.
3. Use the `swiftlink-backend` folder as the service root.
4. Set the build command to:
   ```bash
   npm install
   ```
5. Set the start command to:
   ```bash
   npm start
   ```
6. Add environment variables:
   - `PORT=5000`
   - `JWT_SECRET=<your secret>`
   - `NODE_ENV=production`
   - `DATA_DIR=/data`
7. Mount a persistent disk at `/data`.

### Railway setup
1. Push this repo to GitHub.
2. Create a new service on Railway from the repo.
3. Set the start command to `npm start`.
4. Add environment variables in Railway settings:
   - `PORT=5000`
   - `JWT_SECRET=<your secret>`
   - `NODE_ENV=production`
   - `DATA_DIR=/data`
5. If Railway supports volumes, mount `/data` as the persistent storage path.

### Docker deployment
This repo includes a `Dockerfile` and `.dockerignore`. Use these to run the app in a container.

Example:
```bash
cd swiftlink-backend
docker build -t swiftlink-backend .
docker run -p 5000:5000 -v $(pwd)/data:/data --env DATA_DIR=/data swiftlink-backend
```

## Editing later
- Code changes: edit locally, push to GitHub, and redeploy the service.
- Admin edits: if the host provides real persistent storage, admin updates will remain saved in `data/db.json`.

## Important
If you want truly permanent database storage in cloud production, the best next step is to migrate from local JSON storage to a managed database such as PostgreSQL or MongoDB.

## Running locally
```bash
cd swiftlink-backend
cp .env.example .env
npm install
npm start
```
