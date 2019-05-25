import { SpotifyHelper } from '@helpers/SpotifyHelper';
import { User } from '@models';

export default class SpotifyService {
  public spotify: any;

  public async getUserPlaylists(user: User): Promise<Response> {
    this.spotify = await SpotifyHelper.initializeSpotify(user);
    return this.spotify.getUserPlaylists(user.spotifyUsername);
  }

  public async getPlaylist(user: User, id: string): Promise<Response> {
    this.spotify = await SpotifyHelper.initializeSpotify(user);
    return this.spotify.getPlaylist(id);
  }
}
