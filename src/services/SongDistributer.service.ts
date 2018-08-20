import SocketService from "@services/Socket.service";
import { Sequelize } from "sequelize-typescript";
import { Song } from "@models/Song";
import { Artist } from "@models/Artist";


export default class SongDistrubuterService {
  public static async startSongDistributer() {
    let timerId = setTimeout(async function tick() {
      console.log('outside timeout');

      setTimeout(async () => {
        console.log('inside timeout');

        const song = await SongDistrubuterService.getRandomSong();
        new SocketService().sendNextSong(song);
        timerId = setTimeout(tick, 30000); // (*)
      }, 5000);

      console.log('send pause');
      new SocketService().sendPause();
    }, 0);
  }


  public static async getRandomSong() {
    const song = await Song.find({
      order: [ Sequelize.fn('RAND') ],
      include: [ Artist ],
      where: {
        previewUrl: { $ne: null }
      }
    });

    return song;
  }
}
