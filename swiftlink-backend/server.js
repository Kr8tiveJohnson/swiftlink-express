/**
 * SwiftLink Express — Backend Server
 * Node.js + Express + LowDB (file-based JSON database, zero config)
 */
require('dotenv').config();
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const rateLimit  = require('express-rate-limit');
const path       = require('path');

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
    res.json({ status: 'ok', time: new Date().toISOString(), version: '1.0.0' });
});

app.use((req, res) => {
    res.status(404).json({ error: { code: 404, message: 'Route not found' } });
});

app.use((err, req, res, _next) => {
    console.error('[ERROR]', err.message);
    res.status(err.status || 500).json({ error: { code: err.status || 500, message: err.message || 'Internal server error' } });
});

async function bootstrap() {
    await initDB();
    await seedDatabase();
    app.listen(PORT, () => {
        console.log(`\n✅  SwiftLink Express backend running on http://localhost:${PORT}`);
        console.log(`📊  Admin Dashboard:  http://localhost:${PORT}/admin`);
        console.log(`📦  API Base:         http://localhost:${PORT}/api`);
        console.log(`📁  Database folder:  ${getDataDir()}`);
        console.log(`\n🔑  Default admin credentials:`);
        console.log(`    Email:    admin@swiftlink-express.com`);
        console.log(`    Password: Admin@2025!\n`);
    });
}

bootstrap().catch(err => {
    console.error('Fatal startup error:', err);
    process.exit(1);
});
