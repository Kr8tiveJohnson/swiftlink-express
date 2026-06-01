/**
 * SwiftLink Express — Backend Server (MongoDB version)
 */
require('dotenv').config();
const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const rateLimit = require('express-rate-limit');
const path      = require('path');

const { initDB, getDataDir } = require('./utils/db');
const authRoutes              = require('./routes/auth');
const trackingRoutes          = require('./routes/tracking');
const contactRoutes           = require('./routes/contact');
const adminRoutes             = require('./routes/admin');
const { seedDatabase }        = require('./utils/seed');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200, standardHeaders: true });
app.use('/api/', limiter);
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/auth/', authLimiter);

app.use('/admin', express.static(path.join(__dirname, 'public/admin')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth',     authRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/contact',  contactRoutes);
app.use('/api/admin',    adminRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString(), version: '2.0.0', db: 'MongoDB Atlas' });
});

app.use((req, res) => {
    res.status(404).json({ error: { code: 404, message: 'Route not found' } });
});

app.use((err, req, res, _next) => {
    console.error('[ERROR]', err.message);
    res.status(err.status || 500).json({ error: { code: err.status || 500, message: err.message || 'Internal server error' } });
});

async function bootstrap() {
    console.log('[BOOT] Starting SwiftLink Express...');
    console.log('[BOOT] Node version:', process.version);
    console.log('[BOOT] MONGODB_URI set:', !!process.env.MONGODB_URI);
    console.log('[BOOT] JWT_SECRET set:', !!process.env.JWT_SECRET);
    console.log('[BOOT] NODE_ENV:', process.env.NODE_ENV);
    console.log('[BOOT] PORT:', PORT);
    console.log('[BOOT] Connecting to MongoDB...');
    await initDB();
    console.log('[BOOT] Seeding database...');
    await seedDatabase();
    app.listen(PORT, () => {
        console.log('\n[BOOT] Server is live on port', PORT);
        console.log('[BOOT] Database:', getDataDir());
    });
}

bootstrap().catch(err => {
    console.error('[BOOT] Fatal startup error:', err.message);
    console.error('[BOOT] Stack:', err.stack);
    process.exit(1);
});
