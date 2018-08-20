import { Song } from "@models/Song";
var io = require('../config/websockets').io;

export default class SocketService {
  constructor() {}

  public async sendNextSong(song: Song) {
    const socket = io();
    socket.emit('song', song);
  }


  public async sendPause() {
    const socket = io();
    socket.emit('pause');
  }
}
