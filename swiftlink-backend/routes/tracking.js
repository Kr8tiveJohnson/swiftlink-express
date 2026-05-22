/**
 * Tracking Routes: /api/tracking/*
 * Public endpoints for shipment lookup
 */
const express = require('express');
const { getDB } = require('../utils/db');
const router = express.Router();

// GET /api/tracking/number/:trackingNumber
router.get('/number/:trackingNumber', (req, res) => {
    const db = getDB();
    const settings = db.get('settings').value();
    if (!settings.allowPublicTracking) return res.status(503).json({ error: { message: 'Tracking temporarily unavailable' } });

    const { trackingNumber } = req.params;
    const shipment = db.get('shipments').find({ trackingNumber: trackingNumber.toUpperCase() }).value()
        || db.get('shipments').find({ trackingNumber }).value();

    if (!shipment) return res.status(404).json({ error: { code: 404, message: 'Tracking number not found' } });

    const history = db.get('history')
        .filter({ shipmentId: shipment.id })
        .sortBy(h => new Date(h.timestamp))
        .reverse()
        .value();

    res.json({ data: { shipment, history } });
});

// GET /api/tracking/all  (public list, limited info)
router.get('/all', (req, res) => {
    const db = getDB();
    const shipments = db.get('shipments').map(s => ({
        trackingNumber: s.trackingNumber,
        status: s.status,
        origin: s.origin,
        destination: s.destination,
        shipDate: s.shipDate,
        estimatedDeliveryDate: s.estimatedDeliveryDate
    })).value();
    res.json({ data: { shipments } });
});

module.exports = router;
