/**
 * Admin Routes: /api/admin/*
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
router.get('/stats', (req, res) => {
    const db = getDB();
    const shipments = db.get('shipments').value();
    const users     = db.get('users').value();
    const sessions  = db.get('sessions').value();

    const statusCounts = shipments.reduce((acc, s) => {
        acc[s.status] = (acc[s.status] || 0) + 1; return acc;
    }, {});

    const contacts = db.get('contacts').value();
    res.json({ data: {
        totalShipments: shipments.length,
        statusBreakdown: statusCounts,
        totalUsers:    users.length,
        activeSessions: sessions.filter(s => new Date(s.expiresAt) > new Date()).length,
        totalContacts: contacts.length,
        recentContacts: db.get('contacts').sortBy(c => new Date(c.createdAt)).reverse().take(5).value(),
        recentShipments: db.get('shipments').sortBy(s => new Date(s.createdAt)).reverse().take(5).value()
    }});
});

// ── CONTACT INQUIRIES ───────────────────────────────────────────────────────
router.get('/contacts', (req, res) => {
    const db = getDB();
    const contacts = db.get('contacts').sortBy(c => new Date(c.createdAt)).reverse().value();
    res.json({ data: contacts });
});

router.delete('/contacts/:id', (req, res) => {
    const db = getDB();
    const contact = db.get('contacts').find({ id: req.params.id }).value();
    if (!contact) return res.status(404).json({ error: { message: 'Contact message not found' } });
    db.get('contacts').remove({ id: req.params.id }).write();
    res.json({ data: { message: 'Contact message deleted' } });
});

// ── SHIPMENTS CRUD ────────────────────────────────────────────────────────────
router.get('/shipments', (req, res) => {
    const db = getDB();
    const { q = '', status = '', page = 1, limit = 20 } = req.query;
    let data = db.get('shipments').value();
    if (q) data = data.filter(s => s.trackingNumber.toLowerCase().includes(q.toLowerCase()) || (s.receiver?.name || '').toLowerCase().includes(q.toLowerCase()) || (s.shipper?.name || '').toLowerCase().includes(q.toLowerCase()));
    if (status) data = data.filter(s => s.status === status);
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const total = data.length;
    const p = parseInt(page), l = parseInt(limit);
    const paged = data.slice((p - 1) * l, p * l);
    res.json({ data: paged, meta: { total, page: p, limit: l, pages: Math.ceil(total / l) } });
});

router.get('/shipments/:id', (req, res) => {
    const db = getDB();
    const shipment = db.get('shipments').find({ id: req.params.id }).value()
        || db.get('shipments').find({ trackingNumber: req.params.id }).value();
    if (!shipment) return res.status(404).json({ error: { message: 'Shipment not found' } });
    const history = db.get('history').filter({ shipmentId: shipment.id }).sortBy(h => new Date(h.timestamp)).reverse().value();
    res.json({ data: { shipment, history } });
});

router.post('/shipments', (req, res) => {
    const db = getDB();
    const body = req.body;
    if (!body.trackingNumber) return res.status(400).json({ error: { message: 'trackingNumber is required' } });
    if (db.get('shipments').find({ trackingNumber: body.trackingNumber }).value())
        return res.status(409).json({ error: { message: 'Tracking number already exists' } });

    const now = new Date().toISOString();
    const id  = uuidv4();
    const shipment = { id, ...body, trackingNumber: body.trackingNumber.toUpperCase(), createdAt: now, updatedAt: now };
    db.get('shipments').push(shipment).write();
    res.status(201).json({ data: { shipment } });
});

router.put('/shipments/:id', (req, res) => {
    const db = getDB();
    const shipment = db.get('shipments').find({ id: req.params.id }).value();
    if (!shipment) return res.status(404).json({ error: { message: 'Shipment not found' } });
    const updates = { ...req.body, id: shipment.id, updatedAt: new Date().toISOString() };
    db.get('shipments').find({ id: req.params.id }).assign(updates).write();
    res.json({ data: { shipment: db.get('shipments').find({ id: req.params.id }).value() } });
});

router.delete('/shipments/:id', (req, res) => {
    const db = getDB();
    const shipment = db.get('shipments').find({ id: req.params.id }).value();
    if (!shipment) return res.status(404).json({ error: { message: 'Shipment not found' } });
    db.get('shipments').remove({ id: req.params.id }).write();
    db.get('history').remove({ shipmentId: req.params.id }).write();
    res.json({ data: { message: 'Shipment deleted' } });
});

// ── TRAVEL HISTORY ────────────────────────────────────────────────────────────
router.get('/shipments/:id/history', (req, res) => {
    const db = getDB();
    const shipment = db.get('shipments').find({ id: req.params.id }).value();
    if (!shipment) return res.status(404).json({ error: { message: 'Shipment not found' } });
    const history = db.get('history').filter({ shipmentId: shipment.id }).sortBy(h => new Date(h.timestamp)).reverse().value();
    res.json({ data: history });
});

router.post('/shipments/:id/history', (req, res) => {
    const db = getDB();
    const shipment = db.get('shipments').find({ id: req.params.id }).value();
    if (!shipment) return res.status(404).json({ error: { message: 'Shipment not found' } });
    const entry = { id: uuidv4(), shipmentId: shipment.id, trackingNumber: shipment.trackingNumber, timestamp: req.body.timestamp || new Date().toISOString(), activity: req.body.activity, location: req.body.location || {}, details: req.body.details || '', alerts: req.body.alerts || [] };
    db.get('history').push(entry).write();
    // Update shipment status if provided
    if (req.body.newStatus) db.get('shipments').find({ id: shipment.id }).assign({ status: req.body.newStatus, updatedAt: new Date().toISOString() }).write();
    res.status(201).json({ data: entry });
});

router.put('/history/:entryId', (req, res) => {
    const db = getDB();
    const entry = db.get('history').find({ id: req.params.entryId }).value();
    if (!entry) return res.status(404).json({ error: { message: 'History entry not found' } });
    db.get('history').find({ id: req.params.entryId }).assign({ ...req.body, id: entry.id }).write();
    res.json({ data: db.get('history').find({ id: req.params.entryId }).value() });
});

router.delete('/history/:entryId', (req, res) => {
    const db = getDB();
    if (!db.get('history').find({ id: req.params.entryId }).value()) return res.status(404).json({ error: { message: 'Not found' } });
    db.get('history').remove({ id: req.params.entryId }).write();
    res.json({ data: { message: 'History entry deleted' } });
});

// ── USERS MANAGEMENT ─────────────────────────────────────────────────────────
router.get('/users', (req, res) => {
    const db = getDB();
    const users = db.get('users').map(u => { const { password: _p, ...safe } = u; return safe; }).value();
    res.json({ data: users });
});

router.post('/users', async (req, res) => {
    const db = getDB();
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: { message: 'Name, email, password required' } });
    if (db.get('users').find({ email: email.toLowerCase() }).value()) return res.status(409).json({ error: { message: 'Email already exists' } });
    const hash = await bcrypt.hash(password, 12);
    const newUser = { id: uuidv4(), name, email: email.toLowerCase(), password: hash, role: role || 'customer', verified: true, createdAt: new Date().toISOString() };
    db.get('users').push(newUser).write();
    const { password: _p, ...safe } = newUser;
    res.status(201).json({ data: safe });
});

router.put('/users/:id', async (req, res) => {
    const db = getDB();
    const user = db.get('users').find({ id: req.params.id }).value();
    if (!user) return res.status(404).json({ error: { message: 'User not found' } });
    const updates = { ...req.body, id: user.id };
    if (updates.password) updates.password = await bcrypt.hash(updates.password, 12);
    db.get('users').find({ id: req.params.id }).assign(updates).write();
    const updated = db.get('users').find({ id: req.params.id }).value();
    const { password: _p, ...safe } = updated;
    res.json({ data: safe });
});

router.delete('/users/:id', (req, res) => {
    const db = getDB();
    if (req.params.id === req.user.id) return res.status(400).json({ error: { message: 'Cannot delete your own account' } });
    if (!db.get('users').find({ id: req.params.id }).value()) return res.status(404).json({ error: { message: 'User not found' } });
    db.get('users').remove({ id: req.params.id }).write();
    db.get('sessions').remove({ userId: req.params.id }).write();
    res.json({ data: { message: 'User deleted' } });
});

// ── SESSIONS MANAGEMENT ───────────────────────────────────────────────────────
router.get('/sessions', (req, res) => {
    const db = getDB();
    const { q = '', role = '' } = req.query;
    let users = db.get('users').value();
    if (q) users = users.filter(u => u.email.includes(q) || u.name.toLowerCase().includes(q.toLowerCase()));
    if (role) users = users.filter(u => u.role === role);
    const data = users.map(u => {
        const { password: _p, ...safe } = u;
        const sessions = db.get('sessions').filter({ userId: u.id }).value();
        return { ...safe, sessions };
    });
    res.json({ data, meta: { total: data.length } });
});

router.delete('/sessions/:userId/:sessionId', (req, res) => {
    const db = getDB();
    const session = db.get('sessions').find({ id: req.params.sessionId, userId: req.params.userId }).value();
    if (!session) return res.status(404).json({ error: { message: 'Session not found' } });
    db.get('sessions').remove({ id: req.params.sessionId }).write();
    res.json({ data: { message: 'Session revoked' } });
});

// ── SITE SETTINGS ─────────────────────────────────────────────────────────────
router.get('/settings', (req, res) => {
    res.json({ data: getDB().get('settings').value() });
});

router.put('/settings', (req, res) => {
    const db = getDB();
    db.set('settings', { ...db.get('settings').value(), ...req.body }).write();
    res.json({ data: getDB().get('settings').value() });
});

module.exports = router;
