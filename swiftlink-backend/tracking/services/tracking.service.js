
const { redisClient, redisPub } = require('./redis.service');

class TrackingService {
  static async savePing(data) {
    const key = `courier:location:${data.courierId}`;

    await redisClient.set(
      key,
      JSON.stringify(data),
      'EX',
      60
    );

    await redisPub.publish(
      `courier:${data.courierId}`,
      JSON.stringify(data)
    );

    return data;
  }

  static async getLocation(courierId) {
    const data = await redisClient.get(
      `courier:location:${courierId}`
    );

    return data ? JSON.parse(data) : null;
  }
}

module.exports = TrackingService;
