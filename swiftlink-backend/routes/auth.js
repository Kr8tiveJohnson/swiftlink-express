const express  = require('express');
const bcrypt   = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { getDB }  = require('../utils/db');
const { signToken, requireAuth } = require('../middleware/auth');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: { message: 'Email and password required' } });
        }
        
        const db   = getDB();
        const user = db.get('users').find({ email: email.toLowerCase() }).value();
        
        if (!user) {
            return res.status(401).json({ error: { message: 'Invalid credentials' } });
        }
        
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ error: { message: 'Invalid credentials' } });
        }
        
        const sessionId = uuidv4();
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
        db.get('sessions').push({ 
            id: sessionId, 
            userId: user.id, 
            ip: req.ip, 
            userAgent: req.headers['user-agent'] || 'unknown', 
            deviceName: (req.headers['user-agent'] || '').split('(')[0].trim() || 'Browser', 
            createdAt: new Date().toISOString(), 
            expiresAt 
        }).write();
        
        const token = signToken({ userId: user.id, sessionId, role: user.role });
        const { password: _p, ...safeUser } = user;
        
        return res.json({ data: { token, user: safeUser } });
    } catch (err) {
        console.error('[LOGIN_ERROR]', err);
        return res.status(500).json({ error: { message: 'Login failed: ' + err.message } });
    }
});

router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: { message: 'Name, email and password required' } });
    const db = getDB();
    if (db.get('users').find({ email: email.toLowerCase() }).value()) return res.status(409).json({ error: { message: 'Email already registered' } });
    const hash = await bcrypt.hash(password, 12);
    const newUser = { id: uuidv4(), name, email: email.toLowerCase(), password: hash, role: 'customer', verified: false, createdAt: new Date().toISOString() };
    db.get('users').push(newUser).write();
    const { password: _p, ...safeUser } = newUser;
    res.status(201).json({ data: { user: safeUser, message: 'Account created successfully' } });
});

router.post('/logout', requireAuth, (req, res) => {
    getDB().get('sessions').remove({ id: req.session.id }).write();
    res.json({ data: { message: 'Logged out successfully' } });
});

router.get('/me', requireAuth, (req, res) => {
    const { password: _p, ...safeUser } = req.user;
    res.json({ data: { user: safeUser } });
});

router.post('/resend-verification', (req, res) => {
    res.json({ data: { message: 'If that account exists, a verification email has been sent.' } });
});

module.exports = router;
