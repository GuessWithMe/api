var io = require('../config/websockets').io;
// import  from '../config/websockets';

export default class SocketService {
  constructor() {}

  public async sendNextSong() {
    const socket = io();
    socket.emit('event', {data: 'song'});
  }
}
