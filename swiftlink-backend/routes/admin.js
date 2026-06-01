/**
 * Admin Routes — MongoDB version
 * All routes require admin role JWT
 */
const express = require('express');
const bcrypt  = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDB } = require('../utils/db');
const { requireAdmin } = require('../middleware/auth');
const router = express.Router();

router.use(requireAdmin);

// ── DASHBOARD STATS ───────────────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
    try {
        const db = getDB();
        const shipments = await db.collection('shipments').find().toArray();
        const users     = await db.collection('users').find().toArray();
        const sessions  = await db.collection('sessions').find().toArray();
        const contacts  = await db.collection('contacts').find().toArray();

        const statusCounts = shipments.reduce((acc, s) => {
            acc[s.status] = (acc[s.status] || 0) + 1; return acc;
        }, {});

        const recentContacts  = contacts.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
        const recentShipments = shipments.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

        res.json({ data: {
            totalShipments: shipments.length,
            statusBreakdown: statusCounts,
            totalUsers: users.length,
            activeSessions: sessions.filter(s => new Date(s.expiresAt) > new Date()).length,
            totalContacts: contacts.length,
            recentContacts: recentContacts.map(({ _id, ...c }) => c),
            recentShipments: recentShipments.map(({ _id, ...s }) => s)
        }});
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to load stats' } });
    }
});

// ── CONTACT INQUIRIES ─────────────────────────────────────────────────────────
router.get('/contacts', async (req, res) => {
    try {
        const contacts = await getDB().collection('contacts').find().sort({ createdAt: -1 }).toArray();
        res.json({ data: contacts.map(({ _id, ...c }) => c) });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to load contacts' } });
    }
});

router.delete('/contacts/:id', async (req, res) => {
    try {
        const db = getDB();
        const contact = await db.collection('contacts').findOne({ id: req.params.id });
        if (!contact) return res.status(404).json({ error: { message: 'Contact message not found' } });
        await db.collection('contacts').deleteOne({ id: req.params.id });
        res.json({ data: { message: 'Contact message deleted' } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Delete failed' } });
    }
});

// ── SHIPMENTS CRUD ────────────────────────────────────────────────────────────
router.get('/shipments', async (req, res) => {
    try {
        const db = getDB();
        const { q = '', status = '', page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (q) {
            filter.$or = [
                { trackingNumber: { $regex: q, $options: 'i' } },
                { 'receiver.name': { $regex: q, $options: 'i' } },
                { 'shipper.name':   { $regex: q, $options: 'i' } }
            ];
        }

        const total = await db.collection('shipments').countDocuments(filter);
        const p = parseInt(page), l = parseInt(limit);
        const data = await db.collection('shipments')
            .find(filter)
            .sort({ createdAt: -1 })
            .skip((p - 1) * l)
            .limit(l)
            .toArray();

        res.json({ data: data.map(({ _id, ...s }) => s), meta: { total, page: p, limit: l, pages: Math.ceil(total / l) } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to load shipments' } });
    }
});

router.get('/shipments/:id', async (req, res) => {
    try {
        const db = getDB();
        const shipment = await db.collection('shipments').findOne({ id: req.params.id })
            || await db.collection('shipments').findOne({ trackingNumber: req.params.id });
        if (!shipment) return res.status(404).json({ error: { message: 'Shipment not found' } });

        const history = await db.collection('history')
            .find({ shipmentId: shipment.id })
            .sort({ timestamp: -1 })
            .toArray();

        const { _id, ...safeShipment } = shipment;
        res.json({ data: { shipment: safeShipment, history: history.map(({ _id, ...h }) => h) } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to load shipment' } });
    }
});

router.post('/shipments', async (req, res) => {
    try {
        const db   = getDB();
        const body = req.body;
        if (!body.trackingNumber)
            return res.status(400).json({ error: { message: 'trackingNumber is required' } });

        const exists = await db.collection('shipments').findOne({ trackingNumber: body.trackingNumber.toUpperCase() });
        if (exists) return res.status(409).json({ error: { message: 'Tracking number already exists' } });

        const now = new Date().toISOString();
        const id  = uuidv4();
        const shipment = { id, ...body, trackingNumber: body.trackingNumber.toUpperCase(), createdAt: now, updatedAt: now };
        await db.collection('shipments').insertOne(shipment);
        const { _id, ...safeShipment } = shipment;
        res.status(201).json({ data: { shipment: safeShipment } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to create shipment' } });
    }
});

router.put('/shipments/:id', async (req, res) => {
    try {
        const db = getDB();
        const shipment = await db.collection('shipments').findOne({ id: req.params.id });
        if (!shipment) return res.status(404).json({ error: { message: 'Shipment not found' } });

        const updates = { ...req.body, id: shipment.id, updatedAt: new Date().toISOString() };
        await db.collection('shipments').updateOne({ id: req.params.id }, { $set: updates });
        const updated = await db.collection('shipments').findOne({ id: req.params.id });
        const { _id, ...safe } = updated;
        res.json({ data: { shipment: safe } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to update shipment' } });
    }
});

router.delete('/shipments/:id', async (req, res) => {
    try {
        const db = getDB();
        const shipment = await db.collection('shipments').findOne({ id: req.params.id });
        if (!shipment) return res.status(404).json({ error: { message: 'Shipment not found' } });
        await db.collection('shipments').deleteOne({ id: req.params.id });
        await db.collection('history').deleteMany({ shipmentId: req.params.id });
        res.json({ data: { message: 'Shipment deleted' } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to delete shipment' } });
    }
});

// ── TRAVEL HISTORY ────────────────────────────────────────────────────────────
router.get('/shipments/:id/history', async (req, res) => {
    try {
        const db = getDB();
        const shipment = await db.collection('shipments').findOne({ id: req.params.id });
        if (!shipment) return res.status(404).json({ error: { message: 'Shipment not found' } });
        const history = await db.collection('history')
            .find({ shipmentId: shipment.id })
            .sort({ timestamp: -1 })
            .toArray();
        res.json({ data: history.map(({ _id, ...h }) => h) });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to load history' } });
    }
});

router.post('/shipments/:id/history', async (req, res) => {
    try {
        const db = getDB();
        const shipment = await db.collection('shipments').findOne({ id: req.params.id });
        if (!shipment) return res.status(404).json({ error: { message: 'Shipment not found' } });

        const entry = {
            id: uuidv4(),
            shipmentId: shipment.id,
            trackingNumber: shipment.trackingNumber,
            timestamp: req.body.timestamp || new Date().toISOString(),
            activity: req.body.activity,
            location: req.body.location || {},
            details: req.body.details || '',
            alerts: req.body.alerts || []
        };
        await db.collection('history').insertOne(entry);

        if (req.body.newStatus) {
            await db.collection('shipments').updateOne(
                { id: shipment.id },
                { $set: { status: req.body.newStatus, updatedAt: new Date().toISOString() } }
            );
        }
        const { _id, ...safeEntry } = entry;
        res.status(201).json({ data: safeEntry });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to add history' } });
    }
});

router.put('/history/:entryId', async (req, res) => {
    try {
        const db = getDB();
        const entry = await db.collection('history').findOne({ id: req.params.entryId });
        if (!entry) return res.status(404).json({ error: { message: 'History entry not found' } });
        await db.collection('history').updateOne({ id: req.params.entryId }, { $set: { ...req.body, id: entry.id } });
        const updated = await db.collection('history').findOne({ id: req.params.entryId });
        const { _id, ...safe } = updated;
        res.json({ data: safe });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to update history' } });
    }
});

router.delete('/history/:entryId', async (req, res) => {
    try {
        const db = getDB();
        const entry = await db.collection('history').findOne({ id: req.params.entryId });
        if (!entry) return res.status(404).json({ error: { message: 'Not found' } });
        await db.collection('history').deleteOne({ id: req.params.entryId });
        res.json({ data: { message: 'History entry deleted' } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to delete history' } });
    }
});

// ── USERS MANAGEMENT ─────────────────────────────────────────────────────────
router.get('/users', async (req, res) => {
    try {
        const users = await getDB().collection('users').find().toArray();
        res.json({ data: users.map(({ password: _p, _id, ...u }) => u) });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to load users' } });
    }
});

router.post('/users', async (req, res) => {
    try {
        const db = getDB();
        const { name, email, password, role } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ error: { message: 'Name, email, password required' } });
        const exists = await db.collection('users').findOne({ email: email.toLowerCase() });
        if (exists) return res.status(409).json({ error: { message: 'Email already exists' } });
        const hash = await bcrypt.hash(password, 12);
        const newUser = { id: uuidv4(), name, email: email.toLowerCase(), password: hash, role: role || 'customer', verified: true, createdAt: new Date().toISOString() };
        await db.collection('users').insertOne(newUser);
        const { password: _p, _id, ...safe } = newUser;
        res.status(201).json({ data: safe });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to create user' } });
    }
});

router.put('/users/:id', async (req, res) => {
    try {
        const db = getDB();
        const user = await db.collection('users').findOne({ id: req.params.id });
        if (!user) return res.status(404).json({ error: { message: 'User not found' } });
        const updates = { ...req.body, id: user.id };
        if (updates.password) updates.password = await bcrypt.hash(updates.password, 12);
        await db.collection('users').updateOne({ id: req.params.id }, { $set: updates });
        const updated = await db.collection('users').findOne({ id: req.params.id });
        const { password: _p, _id, ...safe } = updated;
        res.json({ data: safe });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to update user' } });
    }
});

router.delete('/users/:id', async (req, res) => {
    try {
        const db = getDB();
        if (req.params.id === req.user.id)
            return res.status(400).json({ error: { message: 'Cannot delete your own account' } });
        const user = await db.collection('users').findOne({ id: req.params.id });
        if (!user) return res.status(404).json({ error: { message: 'User not found' } });
        await db.collection('users').deleteOne({ id: req.params.id });
        await db.collection('sessions').deleteMany({ userId: req.params.id });
        res.json({ data: { message: 'User deleted' } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to delete user' } });
    }
});

// ── SESSIONS MANAGEMENT ───────────────────────────────────────────────────────
router.get('/sessions', async (req, res) => {
    try {
        const db = getDB();
        const { q = '', role = '' } = req.query;
        const userFilter = {};
        if (role) userFilter.role = role;
        if (q) userFilter.$or = [{ email: { $regex: q, $options: 'i' } }, { name: { $regex: q, $options: 'i' } }];

        const users = await db.collection('users').find(userFilter).toArray();
        const data = await Promise.all(users.map(async u => {
            const { password: _p, _id, ...safe } = u;
            const sessions = await db.collection('sessions').find({ userId: u.id }).toArray();
            return { ...safe, sessions: sessions.map(({ _id, ...s }) => s) };
        }));
        res.json({ data, meta: { total: data.length } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to load sessions' } });
    }
});

router.delete('/sessions/:userId/:sessionId', async (req, res) => {
    try {
        const db = getDB();
        const session = await db.collection('sessions').findOne({ id: req.params.sessionId, userId: req.params.userId });
        if (!session) return res.status(404).json({ error: { message: 'Session not found' } });
        await db.collection('sessions').deleteOne({ id: req.params.sessionId });
        res.json({ data: { message: 'Session revoked' } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to revoke session' } });
    }
});

// ── SITE SETTINGS ─────────────────────────────────────────────────────────────
router.get('/settings', async (req, res) => {
    try {
        const settings = await getDB().collection('settings').findOne({ _type: 'global' });
        const { _id, _type, ...safe } = settings || {};
        res.json({ data: safe || {} });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to load settings' } });
    }
});

router.put('/settings', async (req, res) => {
    try {
        const db = getDB();
        await db.collection('settings').updateOne(
            { _type: 'global' },
            { $set: { ...req.body, _type: 'global' } },
            { upsert: true }
        );
        const updated = await db.collection('settings').findOne({ _type: 'global' });
        const { _id, _type, ...safe } = updated;
        res.json({ data: safe });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to save settings' } });
    }
});

module.exports = router;
