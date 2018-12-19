import sio from 'socket.io';
import GameService from '@services/Game.service';

let io;

export default class Websockets {
  public static initialize(server) {
    io = sio(server);

    io.on('connection', async (socket) => {
      socket.on('event', (data) => {

      });

      socket.on('disconnect', async () => {
        await GameService.removeActiveUser(socket.id);
      });


      socket.on('guessProgressUpdate', async (guessData) => {
        await GameService.updatePlayersGuessProgress(socket.id, guessData);
      });
    });
  }

  public static getIo() {
    return io;
  }
}
