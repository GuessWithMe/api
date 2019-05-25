import { Request, Response } from 'express';
import Environment from '@env';
import { Song, SongArtist, Artist, Album } from '@models';


export async function truncateDatabase(req: Request, res: Response): Promise<Response> {
  try {
    await SongArtist.destroy({ where: {} });
    await Song.destroy({ where: {} });
    await Artist.destroy({ where: {} });
    await Album.destroy({ where: {} });

    return res.status(204).json();
  } catch (err) {
    console.log(err);
  }
}

