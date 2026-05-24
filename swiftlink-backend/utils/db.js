/**
 * LowDB wrapper — file-based JSON database (zero external services needed)
 * Supports a configurable persistent data directory via DATA_DIR.
 */
const low    = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path   = require('path');
const fs     = require('fs');

const DEFAULT_PROD_DATA_DIR = '/data';
const DATA_DIR = process.env.DATA_DIR
    ? path.resolve(process.env.DATA_DIR)
    : (process.env.NODE_ENV === 'production' ? DEFAULT_PROD_DATA_DIR : path.join(__dirname, '..', 'data'));
const DB_FILE = path.join(DATA_DIR, process.env.DB_FILE || 'db.json');

let db;

function initDB() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!process.env.DATA_DIR && process.env.NODE_ENV === 'production') {
        console.warn('⚠️  DATA_DIR is not set. In production, the app should mount a persistent volume at /data for db.json.');
    }
    console.log(`📁  Using database file: ${DB_FILE}`);
    const adapter = new FileSync(DB_FILE);
    db = low(adapter);

    // Schema defaults
    db.defaults({
        users:     [],
        sessions:  [],
        shipments: [],
        history:   [],   // travel/tracking history events
        contacts:  [],   // contact form submissions
        settings:  {
            siteName:     'SwiftLink Express',
            supportEmail: 'support@swiftlink-express.com',
            supportPhone: '+234 (0) 1 460 7700',
            maintenanceMode: false,
            allowPublicTracking: true
        }
    }).write();

    return Promise.resolve(db);
}

function getDB() {
    if (!db) throw new Error('Database not initialized. Call initDB() first.');
    return db;
}

function getDataDir() {
    return DATA_DIR;
}

module.exports = { initDB, getDB, getDataDir };
