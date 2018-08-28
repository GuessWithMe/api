import { ActivePlayerHelper } from "@helpers/ActivePlayerHelper";
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
}
