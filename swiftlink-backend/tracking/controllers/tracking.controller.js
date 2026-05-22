
const TrackingService = require('../services/tracking.service');

exports.ping = async (req, res) => {
  try {
    const payload = {
      courierId: req.user?.id || 'demo-courier',
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      speed: req.body.speed || 0,
      heading: req.body.heading || 0,
      accuracy: req.body.accuracy || 0,
      parcelId: req.body.parcel_id || null,
      timestamp: new Date().toISOString()
    };

    await TrackingService.savePing(payload);

    res.json({
      success: true,
      data: payload
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getCourierLocation = async (req, res) => {
  const data = await TrackingService.getLocation(
    req.params.id
  );

  res.json({
    success: true,
    data
  });
};

exports.getActiveCouriers = async (_req, res) => {
  res.json({
    success: true,
    message: 'Use Redis KEYS courier:location:*'
  });
};
