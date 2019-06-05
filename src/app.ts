import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { Express } from 'express-serve-static-core';
import session from 'express-session';
import http from 'http';
import moment from 'moment';
import morgan from 'morgan';
import passport, { PassportStatic } from 'passport';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import { Sequelize } from 'sequelize-typescript';

import Websockets from '@config/websockets';
import Environment from '@env';
import * as SongDistrubuter from '@services/SongDistributer.service';
import { startWorker } from './worker';

// Routes
import AdminRoutes from '@routes/Admin';
import AuthRoutes from '@routes/Auth';
import GameRoutes from '@routes/Game';
import PlaylistRoutes from '@routes/Playlist';
import UserRoutes from '@routes/User';

import { Album, Artist, Song, SongArtist, User, SongPlaylist, Playlist } from '@models';

class App {
  public app: Express;
  public spotifyStrategy = SpotifyStrategy;
  public server: http.Server;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);

    this.configureWebSockets();
    this.configureSequelize();
    this.configureCors();
    this.configureExpressSession();
    this.setupPassport(passport);
    this.configureMorgan();
    this.mountRoutes();
    this.startSongDistributer();
    startWorker();
  }

  private mountRoutes(): void {
    const router = express.Router();
    this.app.use('/auth', AuthRoutes);
    this.app.use('/game', GameRoutes);
    this.app.use('/playlists', PlaylistRoutes);
    this.app.use('/users', UserRoutes);
    this.app.use('/admin', AdminRoutes);
    this.app.use('/', router);
  }

  private configureCors(): void {
    const corsOptions = {
      credentials: true,
      origin: [Environment.angularUrl, 'https://accounts.spotify.com']
    };

    this.app.use(cors(corsOptions));
  }

  private configureSequelize(): void {
    const sequelize = new Sequelize({
      database: Environment.maria.db,
      dialect: 'mysql',
      host: Environment.maria.host,
      password: Environment.maria.pass,
      port: Environment.maria.port,
      storage: ':memory:',
      username: Environment.maria.user
    });

    sequelize.addModels([Album, Artist, Playlist, Song, SongArtist, SongPlaylist, User]);
  }

  private configureExpressSession() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());

    const RedisStore = require('connect-redis')(session);

    this.app.use(
      session({
        cookie: { secure: false },
        resave: false,
        saveUninitialized: true,
        secret: 'keyboard cat',
        store: new RedisStore({
          host: Environment.redis.host,
          port: Environment.redis.port
        })
      })
    );
  }

  // tslint:disable-next-line: no-shadowed-variable
  private setupPassport(passport: PassportStatic): void {
    passport.serializeUser((user, done) => {
      done(undefined, user);
    });

    passport.deserializeUser((user, done) => {
      done(undefined, user);
    });

    passport.use(
      new SpotifyStrategy(
        {
          callbackURL: `${Environment.apiUrl}/auth/spotify/callback`,
          clientID: Environment.spotifyClientId,
          clientSecret: Environment.spotifyClientSecret
        },
        async (accessToken: string, refreshToken: string, expiresIn: any, profile: any, done: any) => {
          const userData = {
            spotifyAccessToken: accessToken,
            spotifyDisplayName: profile.displayName,
            spotifyId: profile.id,
            spotifyImageUrl: profile.photos[0] || undefined,
            spotifyRefreshToken: refreshToken,
            spotifyUsername: profile.username,
            tokenExpiresAt: moment()
              .add(expiresIn, 'seconds')
              .toDate()
          };

          let user = await User.findOne({
            where: {
              spotifyId: profile.id
            }
          });

          user = user ? await user.update(userData) : await User.create(userData);
          return done(undefined, user);
        }
      )
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());
  }

  private configureMorgan() {
    this.app.use(morgan('tiny'));
  }

  private configureWebSockets() {
    Websockets.initialize(this.server);
  }

  private async startSongDistributer() {
    SongDistrubuter.start();
  }
}

export default new App();
