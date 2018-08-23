import { Request, Response } from 'express';
import SpotifyService from '@services/Spotify.service';

export async function getPlaylists(req: Request, res: Response): Promise<Response> {
  try {
    const playlists = await new SpotifyService().getUserPlaylists(res.locals.user);

    return res.json(playlists.body);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}


export async function importFromPlaylist(req: Request, res: Response): Promise<Response> {
  try {
    const playlist = await new SpotifyService().getPlaylist(req.body.id);
    return res.json(playlist);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}
