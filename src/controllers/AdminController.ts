import { Album, Artist, Playlist, Song, SongArtist, SongPlaylist } from '@models';
import { Handler, Response } from 'express';

export const truncateDatabase: Handler = async (req, res): Promise<Response> => {
  try {
    await SongArtist.destroy({ where: {} });
    await SongPlaylist.destroy({ where: {} });
    await Song.destroy({ where: {} });
    await Artist.destroy({ where: {} });
    await Album.destroy({ where: {} });
    await Playlist.destroy({ where: {} });

    return res.status(204).json();
  } catch (err) {
    console.log(err);
  }
};
