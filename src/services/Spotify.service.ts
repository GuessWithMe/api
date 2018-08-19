import { SpotifyHelper } from "src/helpers/SpotifyHelper";
import { User } from "@models/User";

export default class SpotifyService {
  private spotify;

  constructor() {}

  public async getUserPlaylists(user: User): Promise<Response> {
    this.spotify = await SpotifyHelper.initializeSpotify(user);
    return this.spotify.getUserPlaylists('mistak3nlv');
  }


  public async getPlaylist(user: User, id: string): Promise<Response> {
    this.spotify = await SpotifyHelper.initializeSpotify(user);
    return this.spotify.getPlaylist('mistak3nlv', id);
  }

}
