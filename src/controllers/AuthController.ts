import { Request, Response } from 'express';
import SpotifyService from '@services/Spotify.service';
import Environment from '@env';
import { User } from '@models/User';


export async function loginWithSpotify(req: Request, res: Response): Promise<void> {
  let imageUrl;
  if (req.user.profile.photos.length > 0) {
    imageUrl = req.user.profile.photos[0];
  }

  const user = await User.findOrCreate({
    where: {
      spotifyId: req.user.profile.id,
    },
    defaults: {
      spotifyUsername: req.user.profile.username,
      spotifyAccessToken: req.user.accessToken,
      spotifyRefreshToken: req.user.refreshToken,
      spotifyDisplayName: req.user.profile.displayName,
      spotifyImageUrl: imageUrl,
    }
  });

  req['session']['user'] = user;
  return res.redirect('http://localhost:4200');
}

