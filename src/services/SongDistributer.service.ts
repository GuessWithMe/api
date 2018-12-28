import SocketService from "@services/Socket.service";
import { Sequelize } from "sequelize-typescript";
import { Song, Artist, Album } from "@models";
import moment from 'moment';

let currentSong: Song;
let timer;
let leftCountdown;
let startingTime = moment();


export async function start(): Promise<void> {
  clearInterval(timer);
  await this.sendNextSong();

  timer = setInterval(function tick(self) {
    new SocketService().sendPause(currentSong);
    clearInterval(leftCountdown);
    leftCountdown = setInterval(function() {
      let secondsLeft = moment().diff(startingTime, 'seconds');
    }, 1000);

    setTimeout(async (self) => {
      // Pause ends and a new song gets distributed.
      await self.sendNextSong();
      startingTime = moment();
    }, 5000, self);
  }, 35000, this);
}


export function getStatus(): object {
  return {
    currentSong,
    timeLeft: moment().diff(startingTime, 'seconds')
  }
}


export async function getRandomSong(): Promise<Song> {
  const song = await Song.find({
    order: [ Sequelize.fn('RAND') ],
    include: [ Artist, Album ],
    where: {
      previewUrl: { $ne: null }
    }
  });

  // const song = await Song.findById(267, {
  //   include: [ Artist ]
  // });
  return song;
}


export async function sendNextSong(): Promise<void> {
  const song = await this.getRandomSong();
  currentSong = song;
  new SocketService().sendNextSong(song);
}


/**
 * Sends a pause event and restarts with a new guess after certain number of
 * seconds have passed.
 *
 * @returns Promise<void>
 */
export async function restartAfterPause(): Promise<void> {
  new SocketService().sendPause(currentSong);
  // Start a new after a pause.
  setTimeout(async () => {
    await this.start();
  }, 5000)
}
