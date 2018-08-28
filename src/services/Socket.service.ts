import { Song } from "@models/Song";
var io = require('../config/websockets').io;

export default class SocketService {
  private socket;

  constructor() {
    this.socket = io();
  }

  public sendNextSong(song: Song) {
    this.socket.emit('song', song);
  }


  public sendPause() {
    this.socket.emit('pause');
  }


  public broadcastActivePlayerList(activePlayers: object) {
    const result = Object.keys(activePlayers).map((key) => {
      return {
        spotifyUsername: activePlayers[key].spotifyUsername
      }
    });

    this.socket.emit('activePlayers', result);
  }


  public filterActivePlayers(activePlayers: object): any {
    const socketIds = Object.keys(activePlayers).map((key) => key);

    for (const id of socketIds) {
      if (this.socket.sockets.clients().connected[id]) {

      } else {
        delete activePlayers[id];
      }
    }

    return activePlayers;
  }
}
