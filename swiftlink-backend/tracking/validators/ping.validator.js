
function validatePing(req, res, next) {
  const { latitude, longitude } = req.body;

  if (
    latitude === undefined ||
    longitude === undefined
  ) {
    return res.status(400).json({
      success: false,
      message: 'Latitude and longitude are required'
    });
  }

  next();
}

module.exports = validatePing;
