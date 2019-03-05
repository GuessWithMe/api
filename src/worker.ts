import kue, { Queue, Job } from 'kue';

import Environment from '@env';
import SpotifyService from '@services/Spotify.service';
import { User } from '@models';
import { SpotifySong } from '@t/SpotifySong';
import { ImportHelper } from '@helpers/ImportHelper';
import SocketService from '@services/Socket.service';
import { ActivePlayerHelper } from '@helpers/ActivePlayerHelper';

export let worker: BackgroundWorker;

class BackgroundWorker {
  private queue: Queue;

  constructor() {
    this.queue = kue.createQueue({
      redis: {
        host: Environment.redis.host,
        port: Environment.redis.port,
      }
    });


    this.queue.process('importPlaylist', async (job: Job, done) => {
      try {
        let songsProcessed = 0;

        const songsRes = await new SpotifyService().getPlaylist(
          job.data['user'],
          job.data['playlistId'],
        );

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


          songsProcessed += 1;
          // Sending a message about a song import
          const activePlayers = await ActivePlayerHelper.getActivePlayers();
          const progress =  songsProcessed / songsRes.body['tracks'].items.length;
          let socketId: string;
          for (var key in activePlayers) {
            if (activePlayers[key].id === job.data['user'].id) {
              socketId = key;
              break;
            }
          }

          new SocketService().sendPlaylistImportProgress(socketId, {
            progress,
            playlist: songsRes.body,
          });
        }

        done();
      } catch (error) {
        console.log(error);
        done();
      }
    });
  }


  importPlaylist(user: User, playlistId: string) {
    this.queue.create('importPlaylist', {
      user,
      playlistId,
    }).save();
  }
};


export function startWorker() {
  worker = new BackgroundWorker();
}

