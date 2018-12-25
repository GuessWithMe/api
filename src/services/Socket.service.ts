import { ActivePlayerHelper } from "@helpers/ActivePlayerHelper";
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


  /**
   * Broadcasts active player list to all clients using websockets.
   * @param {object} activePlayers
   */
  public broadcastActivePlayerList(activePlayers: object): void {
    activePlayers = ActivePlayerHelper.filterActivePlayerListForClient(activePlayers);
    this.socket.emit('activePlayers', activePlayers);
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
