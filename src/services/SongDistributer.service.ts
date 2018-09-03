import SocketService from "@services/Socket.service";
import { Sequelize } from "sequelize-typescript";
import { Song } from "@models/Song";
import { Artist } from "@models/Artist";
import moment from 'moment';

let currentSong: Song;
let timer;
let leftCountdown;
let startingTime = moment();


export async function start(): Promise<void> {
  clearInterval(timer);
  await this.sendNextSong();

  timer = setInterval(function tick(self) {
    new SocketService().sendPause();
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


export async function sendNextSong(): Promise<void> {
  const song = await this.getRandomSong();
  currentSong = song;
  new SocketService().sendNextSong(song);
}


export async function restartAfterPause(): Promise<void> {
  new SocketService().sendPause();
  // Start a new after a pause.
  setTimeout(async () => {
    await this.start();
  }, 5000)
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



// export function IntervalTimer(callback, interval) {
//   var timerId, startTime, remaining = 0;
//   var state = 0; //  0 = idle, 1 = running, 2 = paused, 3= resumed

//   this.pause = function () {
//     if (state != 1) return;

//     remaining = interval - (Number(new Date()) - startTime);
//     clearInterval(timerId);
//     state = 2;
//   };

//   this.resume = function () {
//     if (state != 2) return;

//     state = 3;
//     setTimeout(this.timeoutCallback, remaining);
//   };

//   this.timeoutCallback = function () {
//     if (state != 3) return;

//     callback();

//     startTime = new Date();
//     timerId = setInterval(callback, interval);
//     state = 1;
//   };

//   startTime = new Date();
//   timerId = setInterval(callback, interval);
//   state = 1;
// }
