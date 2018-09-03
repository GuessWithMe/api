import { Request, Response } from 'express';
import SpotifyService from '@services/Spotify.service';

export async function getCurrentUser(req: Request, res: Response): Promise<Response> {
  try {
    return res.json(res.locals.user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}
