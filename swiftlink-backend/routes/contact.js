const express = require('express');
const { getDB } = require('../utils/db');
const router = express.Router();

const MAIL_HOST = process.env.MAIL_HOST;
const MAIL_PORT = process.env.MAIL_PORT;
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;
const MAIL_FROM = process.env.MAIL_FROM || MAIL_USER;

let transporter = null;
let emailEnabled = false;
if (MAIL_HOST && MAIL_PORT && MAIL_USER && MAIL_PASS) {
    try {
        const nodemailer = require('nodemailer');
        transporter = nodemailer.createTransport({
            host: MAIL_HOST,
            port: Number(MAIL_PORT),
            secure: Number(MAIL_PORT) === 465,
            auth: { user: MAIL_USER, pass: MAIL_PASS }
        });
        emailEnabled = true;
    } catch (err) {
        console.warn('[CONTACT_EMAIL] Failed to initialize:', err.message);
    }
}

router.post('/', async (req, res) => {
    try {
        const db = getDB();
        const { name, email, phone, trackingRef, message } = req.body;
        if (!name || !email || !message)
            return res.status(400).json({ error: { message: 'Name, email and message are required' } });

        const contact = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : '',
            trackingRef: trackingRef ? trackingRef.trim() : '',
            message: message.trim(),
            createdAt: new Date().toISOString(),
            source: 'website',
            status: 'new'
        };

        await db.collection('contacts').insertOne(contact);

        const settings = await db.collection('settings').findOne({ _type: 'global' });
        const adminTo = (settings && settings.supportEmail) || MAIL_USER || 'support@swiftlink-express.com';

        if (emailEnabled && transporter) {
            try {
                await transporter.sendMail({
                    from: MAIL_FROM || adminTo,
                    to: adminTo,
                    subject: `New SwiftLink inquiry from ${contact.name}`,
                    text: `Name: ${contact.name}\nEmail: ${contact.email}\nPhone: ${contact.phone || 'N/A'}\nTracking Ref: ${contact.trackingRef || 'N/A'}\nSubmitted: ${contact.createdAt}\n\nMessage:\n${contact.message}`
                });
            } catch (err) {
                console.warn('[CONTACT_EMAIL] Failed to deliver email:', err.message);
            }
        }

        res.status(201).json({ data: { contact } });
    } catch (err) {
        res.status(500).json({ error: { message: 'Failed to submit contact' } });
    }
});

module.exports = router;
