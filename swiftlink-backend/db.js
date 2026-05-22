'use strict';
/**
 * db.js — lowdb JSON file-based database
 * Tables (collections): users, shipments, trackingHistory, sessions, contacts
 */

const low  = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const bcrypt   = require('bcryptjs');
const { v4: uuid } = require('uuid');
const path  = require('path');

const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Ensure data directory exists
const fs = require('fs');
fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });

const adapter = new FileSync(DB_PATH);
const db = low(adapter);

function initDb() {
    db.defaults({
        users:          [],
        shipments:      [],
        trackingHistory:[],
        sessions:       [],
        contacts:       [],
        settings:       {
            siteName:  'SwiftLink Express',
            tagline:   'Global Logistics',
            email:     'dispatch@swiftlink-express.com',
            phone:     '+234 (0) 1 460 7700',
            address:   '102 Logistics Blvd, Marina, Lagos, Nigeria',
            heroTitle: 'Your Trusted Global Logistics Partner',
            heroDesc:  'Real-time tracking, express delivery, and premium freight solutions.',
            whatsapp:  '2340000000000',
            maintenanceMode: false,
        }
    }).write();

    // Seed admin user if none exists
    const users = db.get('users').value();
    if (!users.length) {
        const passwordHash = bcrypt.hashSync('Admin@1234', 10);
        db.get('users').push({
            id:        uuid(),
            name:      'Super Admin',
            email:     'admin@swiftlink.com',
            passwordHash,
            role:      'admin',
            verified:  true,
            createdAt: new Date().toISOString(),
        }).write();
        console.log('✅ Seeded default admin: admin@swiftlink.com / Admin@1234');
    }

    // Seed sample shipments from the original mock DB
    const shipments = db.get('shipments').value();
    if (!shipments.length) {
        const samples = [
            {
                id: uuid(),
                trackingNumber: 'KCS00346789-CARGO',
                status: 'on-hold',
                shipDate: '2025-10-07',
                estimatedDeliveryDate: '2025-10-28',
                actualDeliveryDate: null,
                origin: { city: '', country: 'UK', address: '' },
                destination: { address: '58 Hughenden Dr, Leicester LE2 7PX, United Kingdom', city: 'Leicester', country: 'UK' },
                shipper: { name: 'MORRIS EJECTOR', address: '58 Hughenden Dr, Leicester LE2 7PX, United Kingdom' },
                receiver: { name: 'Yama Saffi', address: 'Åsumvej 211 5240 Odense NØ Danmark' },
                cargo: { description: 'IPHONE 17 PRO MAX WHITE COLOUR', weight: { value: 14.20, unit: 'kg' }, quantity: '7 Units' },
                service: { type: 'Air Freight Express Premium', mode: 'Air' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: uuid(),
                trackingNumber: 'SL-505-XYZ',
                status: 'transit',
                shipDate: '2025-11-01',
                estimatedDeliveryDate: '2025-11-18',
                actualDeliveryDate: null,
                origin: { city: 'Singapore', country: 'Singapore', address: '45 Tech Park, Singapore 067897' },
                destination: { address: 'Port Authority Warehouse, Lagos, Nigeria', city: 'Lagos', country: 'Nigeria' },
                shipper: { name: 'TECH INNOVATIONS LTD', address: '45 Tech Park, Singapore 067897' },
                receiver: { name: 'Johnson Okonkwo', address: '23 Commerce Street, Ikoyi, Lagos, Nigeria' },
                cargo: { description: 'ELECTRONICS - 200 UNITS LAPTOP COMPONENTS', weight: { value: 8500, unit: 'kg' }, quantity: '1 x 40FT Container' },
                service: { type: 'Sea Freight FCL Container', mode: 'Sea' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
            {
                id: uuid(),
                trackingNumber: 'SL-101-ABC',
                status: 'delivered',
                shipDate: '2025-10-15',
                estimatedDeliveryDate: '2025-10-22',
                actualDeliveryDate: '2025-10-22',
                origin: { city: 'New York', country: 'USA', address: '789 Commerce Ave, New York, NY 10001' },
                destination: { address: 'Apapa Container Offload Dock, Lagos, Nigeria', city: 'Lagos', country: 'Nigeria' },
                shipper: { name: 'GLOBAL TRADERS USA', address: '789 Commerce Ave, New York, NY 10001, USA' },
                receiver: { name: 'Ada Anambra', address: 'Apapa Container Offload Dock, Lagos, Nigeria' },
                cargo: { description: 'AUTOMOTIVE PARTS - 50 UNITS ENGINE COMPONENTS', weight: { value: 2500, unit: 'kg' }, quantity: '50 Units' },
                service: { type: 'Air Freight Express Premium', mode: 'Air' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            }
        ];

        const historyMap = {
            'KCS00346789-CARGO': [
                { date: '2025-10-29', activity: 'HOLD FOR PRODUCT IMPORTATION FEES 720 EURO', location: 'DENMARK', details: 'ON HOLD', highlight: true },
                { date: '2025-10-28', activity: 'RELEASE AND IN TRANSIT', location: 'DENMARK', details: 'IN TRANSIT', highlight: false },
                { date: '2025-10-27', activity: 'DEPOSIT 200 BALANCE REMAINING 245 EURO', location: 'DENMARK', details: 'ON HOLD', highlight: true },
                { date: '2025-10-07', activity: 'SHIPPED OUT', location: 'UK', details: 'IN TRANSIT', highlight: false }
            ],
            'SL-505-XYZ': [
                { date: '2025-11-15', activity: 'CUSTOMS CLEARANCE PROCESSING', location: 'NIGERIA', details: 'IN CUSTOMS', highlight: true },
                { date: '2025-11-14', activity: 'VESSEL ARRIVED AT PORT TERMINAL', location: 'NIGERIA', details: 'PORT ARRIVAL', highlight: false },
                { date: '2025-11-01', activity: 'SHIPMENT RECEIVED AT PORT', location: 'SINGAPORE', details: 'PROCESSING', highlight: false }
            ],
            'SL-101-ABC': [
                { date: '2025-10-22', activity: 'DELIVERED TO CONSIGNEE', location: 'NIGERIA', details: 'DELIVERED', highlight: false },
                { date: '2025-10-15', activity: 'DEPARTED FROM ORIGIN AIRPORT', location: 'USA', details: 'IN TRANSIT', highlight: false }
            ]
        };

        samples.forEach(s => {
            db.get('shipments').push(s).write();
            const logs = historyMap[s.trackingNumber] || [];
            logs.forEach(log => {
                db.get('trackingHistory').push({
                    id: uuid(),
                    shipmentId: s.id,
                    trackingNumber: s.trackingNumber,
                    timestamp: new Date(log.date).toISOString(),
                    activity: log.activity,
                    location: log.location,
                    details: log.details,
                    alerts: log.highlight ? [log.details] : [],
                    createdAt: new Date().toISOString(),
                }).write();
            });
        });

        console.log('✅ Seeded 3 sample shipments');
    }
}

module.exports = { db, initDb };
