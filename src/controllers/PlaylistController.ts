import SpotifyService from '@services/Spotify.service';
import { Handler, Response } from 'express';

import { worker } from './../worker';

/**
 * Retreives users playlists
 */
export const getPlaylists: Handler = async (req, res): Promise<Response> => {
  try {
    const playlists = await new SpotifyService().getUserPlaylists(res.locals.user);
    return res.json(playlists);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

/**
 * Imports all songs from a players given playlist
 */
export const importPlaylist: Handler = async (req, res): Promise<Response> => {
  worker.importPlaylist(res.locals.user, req.body.playlistId);
  return res.json().status(204);
};
