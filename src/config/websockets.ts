// var sio = require('socket.io');
import sio from 'socket.io';
var io = null;

exports.io = () => {
  return io;
};

exports.initialize = (server) => {
  io = sio(server);

  io.on('connection', async function(client){
    client.on('event', function(data){
      console.log(data);
      console.log('event');
    });

    client.on('disconnect', function(){
      console.log('disconnect');
    });
  });
};
