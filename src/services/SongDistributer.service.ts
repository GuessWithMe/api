import SocketService from "@services/Socket.service";


export default class SongDistrubuterService {
  public static async startSongDistributer() {
    const interval = setInterval(() => {
      new SocketService().sendNextSong();
    }, 1000);

    // clearInterval(interval);
  }
}
