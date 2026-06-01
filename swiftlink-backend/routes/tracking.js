/**
 * Tracking Routes — MongoDB version
 */
const express = require('express');
const { getDB } = require('../utils/db');
const router = express.Router();

router.get('/number/:trackingNumber', async (req, res) => {
    try {
        const db = getDB();
        const settings = await db.collection('settings').findOne({ _type: 'global' });
        if (settings && settings.allowPublicTracking === false)
            return res.status(503).json({ error: { message: 'Tracking temporarily unavailable' } });

        const tn = req.params.trackingNumber.toUpperCase();
        const shipment = await db.collection('shipments').findOne({
            $or: [{ trackingNumber: tn }, { trackingNumber: req.params.trackingNumber }]
        });

        if (!shipment)
            return res.status(404).json({ error: { code: 404, message: 'Tracking number not found' } });

        const history = await db.collection('history')
            .find({ shipmentId: shipment.id })
            .sort({ timestamp: -1 })
            .toArray();

        const { _id, ...safeShipment } = shipment;
        res.json({ data: { shipment: safeShipment, history: history.map(h => { const { _id, ...rest } = h; return rest; }) } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Tracking lookup failed' } });
    }
});

router.get('/all', async (req, res) => {
    try {
        const db = getDB();
        const shipments = await db.collection('shipments').find({}, {
            projection: { trackingNumber: 1, status: 1, origin: 1, destination: 1, shipDate: 1, estimatedDeliveryDate: 1, _id: 0 }
        }).toArray();
        res.json({ data: { shipments } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to fetch shipments' } });
    }
});

module.exports = router;
