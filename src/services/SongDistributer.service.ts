import SocketService from "@services/Socket.service";
import { Sequelize } from "sequelize-typescript";
import { Song } from "@models/Song";
import { Artist } from "@models/Artist";

let currentSong: Song;


export async function start(): Promise<void> {
  let timerId = setTimeout(async function tick(self) {
    const song = await self.getRandomSong();
    currentSong = song;
    new SocketService().sendNextSong(song);
    timerId = setTimeout(tick, 30000, self); // (*)
  }, 0, this);
}


export function getCurrentSong(): Song {
  return currentSong;
}


export async function getRandomSong(): Promise<Song> {
  const song = await Song.find({
    order: [ Sequelize.fn('RAND') ],
    include: [ Artist ],
    where: {
      previewUrl: { $ne: null }
    }
  });

  // const song = await Song.findById(267, {
  //   include: [ Artist ]
  // });
  return song;
}



// export async function startSongDistributer(): Promise<void> {
//   console.log('startSongDistrubuter');
//   let timerId = setTimeout(async function tick(selfOut) {
//     setTimeout(async (self) => {
//       const song = await self.getRandomSong();
//       currentSong = song;
//       new SocketService().sendNextSong(song);
//       timerId = setTimeout(tick, 30000, selfOut); // (*)
//     }, 5000, this);

//     new SocketService().sendPause();
//   }, 0, this);
// }
