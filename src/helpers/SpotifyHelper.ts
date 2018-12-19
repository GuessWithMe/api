import moment from 'moment';
import SpotifyWebApi from 'spotify-web-api-node';

import { User } from '@models';
import Environment from '@env';

export class SpotifyHelper {
  public static async initializeSpotify(user: User): Promise<any> {
    // Checking if token needs to be refreshed
    let spotifyApi = new SpotifyWebApi({
      clientId: Environment.spotifyClientId,
      clientSecret: Environment.spotifyClientSecret,
      accessToken: user.spotifyAccessToken,
      refreshToken: user.spotifyRefreshToken,
    });

    if (moment(user.tokenExpiresAt).diff(moment()) < 0) {
      spotifyApi = await SpotifyHelper.refreshAccessToken(user, spotifyApi);
    }

    return spotifyApi;
  }


  public static async refreshAccessToken(user: User, spotifyApi: SpotifyWebApi): Promise<any> {
    const res = await spotifyApi.refreshAccessToken();
    spotifyApi.setAccessToken(res.body['access_token']);

    return spotifyApi;
  }
}


