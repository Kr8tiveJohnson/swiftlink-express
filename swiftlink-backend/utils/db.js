/**
 * SwiftLink Express — MongoDB Database Utility
 */
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set!');
    process.exit(1);
}

let client;
let db;

async function initDB() {
    try {
        client = new MongoClient(MONGODB_URI, {
            serverSelectionTimeoutMS: 15000,
            connectTimeoutMS: 15000,
            socketTimeoutMS: 15000,
            tls: true,
            tlsAllowInvalidCertificates: true,
            tlsAllowInvalidHostnames: true,
        });

        await client.connect();
        db = client.db('swiftlink');

        // Create indexes
        await db.collection('shipments').createIndex({ trackingNumber: 1 }, { unique: true });
        await db.collection('sessions').createIndex({ id: 1 });
        await db.collection('sessions').createIndex({ userId: 1 });
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('history').createIndex({ shipmentId: 1 });

        console.log('✅  MongoDB connected successfully');
        return db;
    } catch (err) {
        console.error('❌  MongoDB connection failed:', err.message);
        process.exit(1);
    }
}

function getDB() {
    if (!db) throw new Error('Database not initialized. Call initDB() first.');
    return db;
}

function getDataDir() {
    return 'MongoDB Atlas (cloud)';
}

module.exports = { initDB, getDB, getDataDir };
