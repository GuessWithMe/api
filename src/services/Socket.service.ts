import sio from 'socket.io';

import { ActivePlayerHelper } from '@helpers/ActivePlayerHelper';
import { Song } from '@models';
import Websockets from '@config/websockets';

export default class SocketService {
  private socket;

  constructor() {
    this.socket = Websockets.getIo();
  }

  public sendNextSong(song: Song) {
    this.socket.emit('song', song);
  }

  /**
   * Sends a pause event with the last song played for displaying the correct
   * answer
   *
   * @param song - song that just finished playing
   */
  public sendPause(song: Song) {
    this.socket.emit('pause', song);
  }

  /**
   * Broadcasts active player list to all clients using websockets.
   *
   * @param activePlayers
   */
  public broadcastActivePlayerList(activePlayers: object): void {
    activePlayers = ActivePlayerHelper.filterActivePlayerListForClient(activePlayers);
    this.socket.emit('activePlayers', activePlayers);
  }

  public filterActivePlayers(activePlayers: object): any {
    const socketIds = Object.keys(activePlayers).map(key => key);

    for (const id of socketIds) {
      if (this.socket.sockets.clients().connected[id]) {
      } else {
        delete activePlayers[id];
      }
    }

    return activePlayers;
  }

  /**
   * Emits playlist import progress to the importer.
   *
   * @param progress
   */
  public sendPlaylistImportProgress(socketId: string, progress: any): void {
    this.socket.sockets.connected[socketId].send(progress);
  }
}
