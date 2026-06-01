/**
 * SwiftLink Express — MongoDB Seed
 * Seeds admin user and default shipments if they don't already exist.
 */
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('./db');

const ADMIN_EMAIL    = 'admin@swiftlink-express.com';
const ADMIN_PASSWORD = 'Admin@2025!';

const SEED_SHIPMENTS = [
    {
        trackingNumber: 'KCS00346789-CARGO',
        status: 'on-hold',
        shipDate: '2025-10-07',
        estimatedDeliveryDate: '2025-10-28',
        origin: { country: 'UK', city: 'London' },
        destination: { address: '58 Hughenden Dr, Leicester LE2 7PX, United Kingdom / US', city: 'Leicester', country: 'UK' },
        shipper:  { name: 'MORRIS EJECTOR', address: '58 Hughenden Dr, Leicester LE2 7PX, United Kingdom' },
        receiver: { name: 'Yama Saffi', address: 'Åsumvej 211 5240 Odense NØ Danmark' },
        cargo: { description: 'IPHONE 17 PRO MAX WHITE COLOUR', weight: { value: 14.20, unit: 'kg' }, quantity: '7 Units' },
        service: { type: 'Air Freight Express Premium', mode: 'AIR' },
        history: [
            { timestamp: '2025-10-29', activity: 'HOLD FOR PRODUCT IMPORTATION FEES 720 EURO', location: { country: 'Denmark', city: 'Copenhagen' }, details: 'ON HOLD', alerts: ['HOLD'] },
            { timestamp: '2025-10-28', activity: 'RELEASE AND IN TRANSIT', location: { country: 'Denmark', city: 'Copenhagen' }, details: 'IN TRANSIT', alerts: [] },
            { timestamp: '2025-10-07', activity: 'SHIPPED OUT', location: { country: 'UK', city: 'London' }, details: 'IN TRANSIT', alerts: [] }
        ]
    },
    {
        trackingNumber: 'SL-505-XYZ',
        status: 'transit',
        shipDate: '2025-11-01',
        estimatedDeliveryDate: '2025-11-18',
        origin: { country: 'Singapore', city: 'Singapore' },
        destination: { address: 'Port Authority Warehouse, Lagos, Nigeria', city: 'Lagos', country: 'Nigeria' },
        shipper:  { name: 'TECH INNOVATIONS LTD', address: '45 Tech Park, Singapore 067897' },
        receiver: { name: 'Johnson Okonkwo', address: '23 Commerce Street, Ikoyi, Lagos, Nigeria' },
        cargo: { description: 'ELECTRONICS – 200 UNITS LAPTOP COMPONENTS', weight: { value: 8500, unit: 'kg' }, quantity: '1 x 40FT Container' },
        service: { type: 'Sea Freight FCL Container', mode: 'SEA' },
        history: [
            { timestamp: '2025-11-15', activity: 'CUSTOMS CLEARANCE PROCESSING', location: { country: 'Nigeria', city: 'Lagos' }, details: 'IN CUSTOMS', alerts: ['CUSTOMS'] },
            { timestamp: '2025-11-01', activity: 'SHIPMENT RECEIVED AT PORT', location: { country: 'Singapore' }, details: 'PROCESSING', alerts: [] }
        ]
    },
    {
        trackingNumber: 'SL-101-ABC',
        status: 'delivered',
        shipDate: '2025-10-15',
        estimatedDeliveryDate: '2025-10-22',
        actualDeliveryDate: '2025-10-22',
        origin: { country: 'USA', city: 'New York' },
        destination: { address: 'Apapa Container Offload Dock, Lagos, Nigeria', city: 'Lagos', country: 'Nigeria' },
        shipper:  { name: 'GLOBAL TRADERS USA', address: '789 Commerce Ave, New York, NY 10001, USA' },
        receiver: { name: 'Ada Anambra', address: 'Apapa Container Offload Dock, Lagos, Nigeria' },
        cargo: { description: 'AUTOMOTIVE PARTS – 50 UNITS ENGINE COMPONENTS', weight: { value: 2500, unit: 'kg' }, quantity: '50 Units' },
        service: { type: 'Air Freight Express Premium', mode: 'AIR' },
        history: [
            { timestamp: '2025-10-22', activity: 'DELIVERED TO CONSIGNEE', location: { country: 'Nigeria', city: 'Lagos' }, details: 'DELIVERED', alerts: [] },
            { timestamp: '2025-10-15', activity: 'DEPARTED FROM ORIGIN AIRPORT', location: { country: 'USA', city: 'New York' }, details: 'IN TRANSIT', alerts: [] }
        ]
    }
];

async function seedDatabase() {
    const db = getDB();

    // Seed admin user
    const existing = await db.collection('users').findOne({ email: ADMIN_EMAIL });
    if (!existing) {
        const hash = bcrypt.hashSync(ADMIN_PASSWORD, 12);
        await db.collection('users').insertOne({
            id:        uuidv4(),
            name:      'Super Admin',
            email:     ADMIN_EMAIL,
            password:  hash,
            role:      'admin',
            verified:  true,
            createdAt: new Date().toISOString()
        });
        console.log('🌱  Admin user seeded');
    }

    // Seed shipments
    for (const s of SEED_SHIPMENTS) {
        const exists = await db.collection('shipments').findOne({ trackingNumber: s.trackingNumber });
        if (!exists) {
            const id = uuidv4();
            const { history, ...shipmentData } = s;
            await db.collection('shipments').insertOne({
                id,
                ...shipmentData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            // Seed history entries
            for (const h of (history || [])) {
                await db.collection('history').insertOne({
                    id: uuidv4(),
                    shipmentId: id,
                    trackingNumber: s.trackingNumber,
                    ...h
                });
            }
        }
    }

    console.log('🌱  Database seeded successfully');
}

module.exports = { seedDatabase };
