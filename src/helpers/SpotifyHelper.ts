import * as SpotifyWebApi from 'spotify-web-api-node';
import Environment from '@env';

export class SpotifyHelper {
  public static async initializeSpotify(): Promise<any> {
    const spotifyApi = new SpotifyWebApi({
      clientId: Environment.spotifyClientId,
      clientSecret: Environment.spotifyClientSecret,
    });

    // Retrieve an access token.
    try {
      const res = await spotifyApi.clientCredentialsGrant();

      // Set all credentials at the same time
      spotifyApi.setCredentials({
        accessToken: res['body']['access_token'],
      });
    } catch (error) {
      console.log('Something went wrong when retrieving an access token', error);
    }

    return spotifyApi;
  }
}


