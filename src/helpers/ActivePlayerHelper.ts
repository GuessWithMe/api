import { getConnection as getRedisConnection, ACTIVE_PLAYERS_KEY } from '@config/redis';
import SocketService from '@services/Socket.service';

export class ActivePlayerHelper {
  public static async setActivePlayers(activePlayers: object): Promise<any> {
    // Double check if connections are open.
    activePlayers = new SocketService().filterActivePlayers(activePlayers);

    return new Promise((resolve, reject) => {
      const RedisClient = getRedisConnection();
      RedisClient.set(`${ACTIVE_PLAYERS_KEY}`, JSON.stringify(activePlayers), (error, result) => {
        if (error) {
          reject(error);
        }

        resolve(result);
      });
    });
  }


  public static async getActivePlayers(): Promise<any> {
    return new Promise((resolve, reject) => {
      const RedisClient = getRedisConnection();
      RedisClient.get(`${ACTIVE_PLAYERS_KEY}`, (error, result) => {
        if (error) {
          reject(error);
        }

        if (result) {
          resolve(JSON.parse(result));
        } else {
          resolve({});
        }
      });
    });
  }


  /**
   * Changes active player list from object to array, filters sensitive data
   * @static
   * @param {object} activePlayers
   * @returns object[]
   */
  public static filterActivePlayerListForClient(activePlayers: object): object[] {
    return Object.keys(activePlayers).map((key) => {
      return {
        id: activePlayers[key].id,
        spotifyUsername: activePlayers[key].spotifyUsername,
        titleCorrect: activePlayers[key].titleCorrect || false,
        artistCorrect: activePlayers[key].artistCorrect || false
      }
    });
  }
}


