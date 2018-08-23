import { Request, Response } from 'express';

import * as SongDistributer from '@services/SongDistributer.service';


export async function getCurrentSong(req: Request, res: Response): Promise<Response> {
  try {
    const currentSong = SongDistributer.getCurrentSong();
    return res.json(currentSong);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}
