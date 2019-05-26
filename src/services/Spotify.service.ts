import { SpotifyHelper } from '@helpers/SpotifyHelper';
import { User } from '@models';
import { SpotifyPlaylist } from '@t/SpotifyPlaylist';
import { SpotifyPlaylists } from '@t/SpotifyPlaylists';

export default class SpotifyService {
  public spotify: any;

  public async getUserPlaylists(user: User): Promise<SpotifyPlaylists> {
    this.spotify = await SpotifyHelper.initializeSpotify(user);
    const res = await this.spotify.getUserPlaylists(user.spotifyUsername);
    return res.body;
  }

  public async getPlaylist(user: User, id: string): Promise<SpotifyPlaylist> {
    this.spotify = await SpotifyHelper.initializeSpotify(user);
    const res = await this.spotify.getPlaylist(id);
    return res.body;
  }
}
