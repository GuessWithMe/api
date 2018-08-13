import { Request, Response } from 'express';
import SpotifyService from '@services/Spotify.service';
import Environment from '@env';
import { User } from '@models/User';


export async function loginWithSpotify(req: Request, res: Response): Promise<void> {
  req.session.user = req.user;
  return res.redirect('http://localhost:4200');
}

