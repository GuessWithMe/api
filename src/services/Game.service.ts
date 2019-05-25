import { ActivePlayerHelper } from "@helpers/ActivePlayerHelper";
import * as SongDistrubuter from '@services/SongDistributer.service';
import SocketService from "@services/Socket.service";


export default class GameService {
  public static async removeActiveUser(socketId: string) {
    let activePlayers = await ActivePlayerHelper.getActivePlayers();

    if (!activePlayers) {
      activePlayers = {};
    }
    delete activePlayers[socketId];

    await ActivePlayerHelper.setActivePlayers(activePlayers);
    new SocketService().broadcastActivePlayerList(activePlayers);
  }


  public static async updatePlayersGuessProgress(socketId: string, guessData: object) {
    let activePlayers = await ActivePlayerHelper.getActivePlayers();


    if (!activePlayers) {
      activePlayers = {};
    }

    activePlayers[socketId] = {
      ...activePlayers[socketId],
      titleCorrect: guessData['titleCorrect'] || false,
      artistCorrect: guessData['artistCorrect'] || false,
    }


    if (GameService.areAllPlayersFinished(activePlayers)) {
      // Set all active player guess statuses as false.
      activePlayers = await GameService.resetGuessStatuses(activePlayers);
      await SongDistrubuter.restartAfterPause();
      return;
    }

    await ActivePlayerHelper.setActivePlayers(activePlayers);
    new SocketService().broadcastActivePlayerList(activePlayers);
  }


  private static areAllPlayersFinished(activePlayers: object) {
    for (let socketId in activePlayers) {
      if (!activePlayers[socketId].titleCorrect || !activePlayers[socketId].artistCorrect) {
        return false;
      }
    }

    return true;
  }


  private static async resetGuessStatuses(activePlayers) {
    const newActivePlayers = {};
    for (let socketId in activePlayers) {
      newActivePlayers[socketId] = {
        ...activePlayers[socketId],
        titleCorrect: false,
        artistCorrect: false,
      }
    }

    await ActivePlayerHelper.setActivePlayers(newActivePlayers);
    new SocketService().broadcastActivePlayerList(newActivePlayers);
  }
}
