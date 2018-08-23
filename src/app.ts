import { Sequelize } from 'sequelize-typescript';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import cors from 'cors';
import express from 'express'
import session from 'express-session';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import moment from 'moment';
const passport = require('passport');

import { User } from '@models/User';
import Environment from '@env';
import * as SongDistrubuter from '@services/SongDistributer.service';

// Routes
import AuthRoutes from '@routes/Auth';
import GameRoutes from '@routes/Game';
import PlaylistRoutes from '@routes/Playlist';
import UserRoutes from '@routes/User';


class App {
  public express: any;
  public corsOptions: object;
  public spotifyStrategy = SpotifyStrategy;

  constructor() {
    this.express = express();
    this.configureSequelize();
    this.configureCors();
    this.configureExpressSession();
    this.setupPassport(passport);
    this.configureMorgan();
    this.configureWebSockets();
    this.mountRoutes();
    this.startSongDistributer();
  }


  private mountRoutes(): void {
    const router = express.Router()
    this.express.use('/auth', AuthRoutes);
    this.express.use('/game', GameRoutes);
    this.express.use('/playlists', PlaylistRoutes);
    this.express.use('/users', UserRoutes);
    this.express.use('/', router);
  }


  private configureCors(): void {
    const corsOptions = {
      // allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      // methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: [
        'http://localhost:4200',
        'https://accounts.spotify.com'
      ],
      // preflightContinue: false,
    }

    this.express.use(cors(corsOptions));
    // this.express.options("*", cors(corsOptions))
  }


  private configureSequelize(): void {
    const sequelize =  new Sequelize({
      database: Environment.maria.db,
      dialect: 'mysql',
      username: Environment.maria.user,
      password: Environment.maria.pass,
      storage: ':memory:',
      modelPaths: [__dirname + '/models'],
      port: Environment.maria.port,
    });
  }


  private configureExpressSession() {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(cookieParser());


    var RedisStore = require('connect-redis')(session);

    this.express.use(session({
      store: new RedisStore({
        host: Environment.redis.host,
        port: Environment.redis.port,
      }),
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: { secure: ( Environment.env === 'production') }
      // cookie: {}
    }))
  }


  private setupPassport(passport: any): void {
    passport.serializeUser((user, done) => {
      done(undefined, user);
    });

    passport.deserializeUser((user, done) => {
      done(null, user);
    });

    passport.use(
      new SpotifyStrategy(
        {
          clientID: Environment.spotifyClientId,
          clientSecret: Environment.spotifyClientSecret,
          callbackURL: 'http://localhost:3000/auth/spotify/callback'
        },
        async (accessToken, refreshToken, expires_in, profile, done) => {
          let imageUrl;
          if (profile.photos.length > 0) {
            imageUrl = profile.photos[0];
          }

          const userData = {
            spotifyAccessToken: accessToken,
            spotifyDisplayName: profile.displayName,
            spotifyId: profile.id,
            spotifyImageUrl: imageUrl,
            spotifyRefreshToken: refreshToken,
            spotifyUsername: profile.username,
            tokenExpiresAt: moment().add(expires_in, 'seconds').toDate(),
          }

          let user = await User.find({ where: {
            spotifyId: profile.id,
          }});

          if (user) {
            user = await user.update(userData);
          } else {
            user = await User.create(userData);
          }

          return done(undefined, user);
        }
      )
    );

    this.express.use(passport.initialize());
    this.express.use(passport.session());
  }


  private configureMorgan() {
    this.express.use(morgan('tiny'));
  }


  private configureWebSockets() {
    var server = require('http').createServer(this.express);
    var io = require('./config/websockets.ts').initialize(server);
    server.listen(3001);
  }


  private async startSongDistributer() {
    SongDistrubuter.start();
  }
}

export default new App().express;
