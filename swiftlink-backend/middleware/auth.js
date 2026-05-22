const jwt = require('jsonwebtoken');
const { getDB } = require('../utils/db');

const JWT_SECRET = process.env.JWT_SECRET || 'swiftlink_jwt_secret_change_in_production_2025';

function signToken(payload, expiresIn = '7d') {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}
function verifyToken(token) { return jwt.verify(token, JWT_SECRET); }

function requireAuth(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: { code: 401, message: 'Authentication required' } });
    }
    const token = header.slice(7);
    try {
        const payload = verifyToken(token);
        const db = getDB();
        const session = db.get('sessions').find({ id: payload.sessionId, userId: payload.userId }).value();
        if (!session) return res.status(401).json({ error: { code: 401, message: 'Session expired or revoked' } });
        if (new Date(session.expiresAt) < new Date()) return res.status(401).json({ error: { code: 401, message: 'Session expired' } });
        const user = db.get('users').find({ id: payload.userId }).value();
        if (!user) return res.status(401).json({ error: { code: 401, message: 'User not found' } });
        req.user = user; req.session = session;
        next();
    } catch (err) {
        return res.status(401).json({ error: { code: 401, message: 'Invalid or expired token' } });
    }
}

function requireAdmin(req, res, next) {
    requireAuth(req, res, () => {
        if (req.user.role !== 'admin') return res.status(403).json({ error: { code: 403, message: 'Admin access required' } });
        next();
    });
}

module.exports = { signToken, verifyToken, requireAuth, requireAdmin };
