
const socketIO = require('socket.io');
const { redisSub } = require('../services/redis.service');

function initTrackingSocket(server) {
  const io = socketIO(server, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', (socket) => {

    socket.on('track:courier', ({ courierId }) => {
      socket.join(`courier:${courierId}`);
    });

    socket.on('track:parcel', ({ parcelId }) => {
      socket.join(`parcel:${parcelId}`);
    });

  });

  redisSub.psubscribe('courier:*');

  redisSub.on(
    'pmessage',
    (_pattern, channel, message) => {

      const data = JSON.parse(message);

      io.to(channel).emit(
        'location:update',
        data
      );
    }
  );

  return io;
}

module.exports = initTrackingSocket;
