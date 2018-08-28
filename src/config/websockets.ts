// var sio = require('socket.io');
import sio from 'socket.io';
import GameService from '@services/Game.service';
var io = null;

exports.io = () => {
  return io;
};

exports.initialize = (server) => {
  io = sio(server);

  io.on('connection', async (socket) => {
    socket.on('event', (data) => {

    });

    socket.on('disconnect', async () => {
      await GameService.removeActiveUser(socket.id);
    });
  });
};
