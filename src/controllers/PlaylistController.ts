import { Request, Response } from 'express';

import { ImportHelper } from '@helpers/ImportHelper';
import SpotifyService from '@services/Spotify.service';
import { SpotifySong } from '@t/SpotifySong';
import { worker } from './../worker';

export async function getPlaylists(req: Request, res: Response): Promise<Response> {
  try {
    const playlists = await new SpotifyService().getUserPlaylists(res.locals.user);

    return res.json(playlists.body);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}

/**
 * Imports all the possible songs from a players given playlist
 */
export async function importPlaylist(req: Request, res: Response): Promise<any> {
  // worker.importPlaylist(res.locals.user, req.body.playlist.spotifyId);
  // return res.json().status(204);

  try {
    const songsRes = await new SpotifyService().getPlaylist(res.locals.user, req.body.playlistId);
    console.log(songsRes);

    for (const s of songsRes.body['tracks'].items as SpotifySong[]) {
      // No use from local tracks since we can't play them
      // for everyone.
      if (s.is_local) {
        continue;
      }

      const songArtists = [];
      for (const spotifyArtist of s.track.artists) {
        const artist = await ImportHelper.importArtist(spotifyArtist);
        songArtists.push(artist);
      }

      const song = await ImportHelper.importSong(s.track);
      await song.$set('artists', songArtists);

      const album = await ImportHelper.importAlbum(s.track.album);
      await song.$set('album', album);
    }

    return res.json({ status: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json(error.message);
  }
}
