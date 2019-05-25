import SocketService from "@services/Socket.service";
import { Sequelize } from "sequelize-typescript";
import { Song, Artist, Album } from "@models";
import moment from 'moment';

const PAUSE_LENGTH = 5000;
const GUESS_TIME = 30000;

let currentSong: Song;
let previousSong: Song;
let isPaused = false;
let timer: NodeJS.Timer;
let leftCountdown: NodeJS.Timer;
let startingTime = moment();


export async function start(): Promise<void> {
  clearInterval(timer);
  startingTime = moment();
  await this.sendNextSong();

  timer = setInterval((self) => {
    self.processSongEnding()
    clearInterval(leftCountdown);
    leftCountdown = setInterval(function() {
      let secondsLeft = moment().diff(startingTime, 'seconds');
    }, 1000);

    setTimeout(async (self) => {
      // Pause ends and a new song gets distributed.
      await self.sendNextSong();
      startingTime = moment();
    }, PAUSE_LENGTH, self);
  }, GUESS_TIME + PAUSE_LENGTH, this);
}


export function getStatus(): object {
  return {
    currentSong,
    previousSong,
    timeLeft: GUESS_TIME/1000 - moment().diff(startingTime, 'seconds'),
    isPaused,
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
  isPaused = false;
  new SocketService().sendNextSong(song);
}


export async function processSongEnding(): Promise<void> {
  previousSong = currentSong;
  currentSong = null;
  isPaused = true;
  new SocketService().sendPause(previousSong);
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
  }, PAUSE_LENGTH)
}
