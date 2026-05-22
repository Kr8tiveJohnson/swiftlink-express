
const Redis = require('ioredis');

const redisClient = new Redis(process.env.REDIS_URL);
const redisPub = new Redis(process.env.REDIS_URL);
const redisSub = new Redis(process.env.REDIS_URL);

module.exports = {
  redisClient,
  redisPub,
  redisSub
};
