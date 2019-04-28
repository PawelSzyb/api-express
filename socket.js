let io;

module.exports = {
  init: (httpServer) => {
    let io = require('socket.io')(httpServer);
    return io;
  },
  getIo: () => {
    if (!io) {
      throw new Error('Socket.io not initialized');
    }
    return io;
  }
};
