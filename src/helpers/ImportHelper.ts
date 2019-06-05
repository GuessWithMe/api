import moment from 'moment';

import { Album, Artist, Song, Playlist, User } from '@models';
import { SpotifyPlaylist } from '@t/SpotifyPlaylist';
import { Album as SpotifyAlbum } from '@t/SpotifySong';

export class ImportHelper {
  public static async importSong(track: any): Promise<Song> {
    let song = await Song.findOne({ where: { spotifyId: track.id } });

    const songObject = {
      name: track.name,
      popularity: track.popularity,
      previewUrl: track.preview_url,
      spotifyId: track.id,
      spotifyUrl: track.external_urls.spotify
    };

    song = song ? await song.update(songObject) : await Song.create(songObject);
    return song;
  }

  public static async importArtist(spotifyArtist: any): Promise<Artist> {
    let artist = await Artist.findOne({
      where: {
        spotifyId: spotifyArtist.id
      }
    });

    const artistObject = {
      name: spotifyArtist.name,
      spotifyId: spotifyArtist.id,
      spotifyUrl: spotifyArtist.external_urls.spotify
    };

    artist = artist ? await artist.update(artistObject) : await Artist.create(artistObject);
    return artist;
  }

  public static async createOrUpdatePlaylist(
    user: User,
    spotifyPlaylist: SpotifyPlaylist,
    eligibleTracks: number
  ): Promise<Playlist> {
    let playlist = await Playlist.findOne({
      where: {
        spotifyId: spotifyPlaylist.id,
        userId: user.id
      }
    });

    const playlistObject = {
      eligibleSongsAtLastImport: eligibleTracks,
      lastImportAt: new Date(),
      spotifyId: spotifyPlaylist.id,
      totalSongsAtLastImport: spotifyPlaylist.tracks.items.length,
      userId: user.id
    };

    playlist = playlist ? await playlist.update(playlistObject) : await Playlist.create(playlistObject);
    return playlist;
  }

  /**
   * Imports an album and it's properties.
   *
   * @static
   * @param {SpotifyAlbum} spotifyAlbum
   * @returns Promise<Album>
   * @memberof ImportHelper
   */
  public static async importAlbum(spotifyAlbum: SpotifyAlbum): Promise<Album> {
    let album = await Album.findOne({
      where: {
        spotifyId: spotifyAlbum.id
      }
    });

    let imageUrl: string;
    if (spotifyAlbum.images && spotifyAlbum.images.length > 0) {
      imageUrl = spotifyAlbum.images[1].url;
    }

    let releaseDate: Date;
    switch (spotifyAlbum.release_date_precision) {
      case 'year': {
        releaseDate = moment.utc(spotifyAlbum.release_date, 'YYYY').toDate();
        break;
      }
      case 'month': {
        releaseDate = moment.utc(spotifyAlbum.release_date, 'YYYY-MM').toDate();
        break;
      }
      case 'day': {
        releaseDate = moment.utc(spotifyAlbum.release_date, 'YYYY-MM-DD').toDate();
        break;
      }
    }

    const albumObject = {
      imageUrl,
      name: spotifyAlbum.name,
      releaseDate,
      spotifyId: spotifyAlbum.id,
      spotifyUrl: spotifyAlbum.external_urls.spotify
    };

    album = album ? await album.update(albumObject) : await Album.create(albumObject);
    return album;
  }
}
