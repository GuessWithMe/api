import { SpotifyHelper } from "src/helpers/SpotifyHelper";

export default class SpotifyService {
  private spotify;

  constructor() {}

  public async getUserPlaylists(): Promise<Response> {
    this.spotify = await SpotifyHelper.initializeSpotify();
    return this.spotify.getUserPlaylists('mistak3nlv');
  }


  public async getPlaylist(id: string): Promise<Response> {
    this.spotify = await SpotifyHelper.initializeSpotify();
    return this.spotify.getPlaylist('mistak3nlv', id);
  }
}
