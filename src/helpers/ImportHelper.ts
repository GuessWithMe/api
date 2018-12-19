import { Artist, Song } from "@models";

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
}


