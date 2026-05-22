
const axios = require('axios');
const TrackingService = require('./tracking.service');

async function calculateETA(courierId, destination) {
  const location = await TrackingService.getLocation(courierId);

  if (!location) return null;

  const response = await axios.get(
    'https://maps.googleapis.com/maps/api/directions/json',
    {
      params: {
        origin: `${location.latitude},${location.longitude}`,
        destination,
        key: process.env.GOOGLE_MAPS_API_KEY
      }
    }
  );

  const route = response.data.routes[0];

  if (!route) return null;

  const seconds = route.legs[0].duration.value;

  return new Date(Date.now() + seconds * 1000);
}

module.exports = { calculateETA };
