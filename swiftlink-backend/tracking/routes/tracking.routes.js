
const express = require('express');
const router = express.Router();

const controller = require('../controllers/tracking.controller');
const validatePing = require('../validators/ping.validator');

router.post(
  '/location/ping',
  validatePing,
  controller.ping
);

router.get(
  '/location/couriers/:id/location',
  controller.getCourierLocation
);

router.get(
  '/location/couriers/active',
  controller.getActiveCouriers
);

module.exports = router;
