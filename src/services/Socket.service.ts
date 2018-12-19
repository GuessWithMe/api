import { Song } from "@models";
import Websockets from "@config/websockets";

export default class SocketService {
  private socket;

  constructor() {
    this.socket = Websockets.getIo();
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
        id: activePlayers[key].id,
        spotifyUsername: activePlayers[key].spotifyUsername,
        titleCorrect: activePlayers[key].titleCorrect || false,
        artistCorrect: activePlayers[key].artistCorrect || false
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
