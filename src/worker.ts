import kue, { Job, Queue } from 'kue';

import Environment from '@env';
import { ActivePlayerHelper } from '@helpers/ActivePlayerHelper';
import { ImportHelper } from '@helpers/ImportHelper';
import { User } from '@models';
import SocketService from '@services/Socket.service';
import SpotifyService from '@services/Spotify.service';
import { SpotifySong } from '@t/SpotifySong';

export let worker: BackgroundWorker;

class BackgroundWorker {
  private queue: Queue;

  constructor() {
    this.queue = kue.createQueue({
      redis: {
        host: Environment.redis.host,
        port: Environment.redis.port
      }
    });

    this.queue.process('importPlaylist', async (job: Job, done: any) => {
      try {
        let songsProcessed = 0;

        const playlist = await new SpotifyService().getPlaylist(job.data.user, job.data.playlistId);
        const eligibleTracks = playlist.tracks.items.filter(s => !s.is_local);

        const dbPlaylist = await ImportHelper.createOrUpdatePlaylist(job.data.user, playlist, eligibleTracks.length);

        for (const s of eligibleTracks as SpotifySong[]) {
          const songArtists = [];
          for (const spotifyArtist of s.track.artists) {
            job.log(JSON.stringify(spotifyArtist));
            const artist = await ImportHelper.importArtist(spotifyArtist);
            songArtists.push(artist);
          }

          const song = await ImportHelper.importSong(s.track);
          await song.$set('artists', songArtists);

          const album = await ImportHelper.importAlbum(s.track.album);
          await song.$set('album', album);

          await song.$add('playlist', dbPlaylist);

          songsProcessed += 1;
          // Sending a message about a song import
          const activePlayers = await ActivePlayerHelper.getActivePlayers();
          const progress = songsProcessed / eligibleTracks.length;
          let socketId: string;
          for (const key in activePlayers) {
            if (activePlayers[key].id === job.data.user.id) {
              socketId = key;
              break;
            }
          }

          new SocketService().sendPlaylistImportProgress(socketId, {
            playlist: {
              id: playlist.id,
              name: playlist.name
            },
            progress
          });
        }

        done();
      } catch (error) {
        done(error);
      }
    });
  }

  public importPlaylist(user: User, playlistId: string) {
    const job = this.queue.create('importPlaylist', { user, playlistId }).save();

    job
      .on('complete', result => {
        console.log('Job completed with data ', result);
      })
      .on('failed attempt', (errorMessage, doneAttempts) => {
        console.log('Job failed', errorMessage);
      })
      .on('failed', errorMessage => {
        console.log('Job failed');
      })
      .on('progress', (progress, data) => {
        console.log('\r  job #' + job.id + ' ' + progress + '% complete with data ', data);
      });
  }
}

export function startWorker() {
  worker = new BackgroundWorker();
}
