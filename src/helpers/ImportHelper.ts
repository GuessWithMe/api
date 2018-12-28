import moment from 'moment';

import { Artist, Song, Album } from "@models";
import { Album as SpotifyAlbum } from "@t/SpotifySong";

export class ImportHelper {
  public static async importSong(track: any): Promise<Song> {
    let song = await Song.findOne({ where: { spotifyId: track.id  }})

    const songObject = {
      name: track.name,
      popularity: track.popularity,
      previewUrl: track.preview_url,
      spotifyId: track.id,
      spotifyUrl: track.external_urls.spotify
    }

    if (song) {
      song = await song.update(songObject);
    } else {
      song = await Song.create(songObject);
    }

    return song;
  }


  public static async importArtist(spotifyArtist: any): Promise<Artist> {
    let artist = await Artist.findOne({ where: {
      spotifyId: spotifyArtist.id
    }});

    const artistObject = {
      name: spotifyArtist.name,
      spotifyUrl: spotifyArtist.external_urls.spotify,
      spotifyId: spotifyArtist.id,
    }

    if (artist) {
      artist = await artist.update(artistObject);
    } else {
      artist = await Artist.create(artistObject);
    }

    return artist;
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
    let album = await Album.findOne({ where: {
      spotifyId: spotifyAlbum.id
    }});

    let imageUrl: string = null;
    if (spotifyAlbum.images && spotifyAlbum.images.length > 0) {
      imageUrl = spotifyAlbum.images[1].url;
    }

    const albumObject = {
      name: spotifyAlbum.name,
      spotifyUrl: spotifyAlbum.external_urls.spotify,
      imageUrl,
      releaseDate: moment.utc(spotifyAlbum.release_date).toDate(),
      spotifyId: spotifyAlbum.id,
    }

    if (album) {
      album = await album.update(albumObject);
    } else {
      album = await Album.create(albumObject);
    }

    return album;
  }
}


