import { Sequelize } from 'sequelize-typescript';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import cors from 'cors';
import express from 'express'
import morgan from 'morgan';
const passport = require('passport');

import { SpotifyHelper } from './helpers/SpotifyHelper';
import { User } from '@models/User';
import Environment from '@env';

// Routes
import UserRoutes from '@routes/User';
import AuthRoutes from '@routes/Auth';


class App {
  public express: any;
  public corsOptions: object;
  public spotifyStrategy = SpotifyStrategy;

  constructor() {
    this.express = express();
    this.configureSequelize();
    this.configureCors();
    this.setupPassport(passport);
    this.configureMorgan();

    this.mountRoutes();
  }

  private mountRoutes(): void {
    const router = express.Router()
    router.get('/', async (req, res) => {
      const spotify = await SpotifyHelper.initializeSpotify();

      let res2;
      try {
        res2 = await spotify.getTrack('5ikzUqSyy8XiZYvVQncA4n')
        return res.json(res2.body)
      } catch (error) {
        return res.status(500).json(error);
      }
    });

    this.express.use('/users', UserRoutes);
    this.express.use('/auth', AuthRoutes);
    this.express.use('/', router);
  }

  private configureCors(): void {
    const corsOptions = {
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: [
        'http://localhost:4200',
        'https://accounts.spotify.com'
      ],
      preflightContinue: false
    }

    this.express.use(cors(corsOptions));
    this.express.options("*", cors(corsOptions))
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


  private setupPassport(passport: any): void {
    passport.serializeUser((object, done) => {
      done(undefined, object);
    });

    passport.deserializeUser(async (id, done) => {
      done();
    });

    passport.use(
      new SpotifyStrategy(
        {
          clientID: Environment.spotifyClientId,
          clientSecret: Environment.spotifyClientSecret,
          callbackURL: 'http://localhost:3000/auth/spotify/callback'
        },
        function(accessToken, refreshToken, expires_in, profile, done) {
          return done(undefined, { profile, accessToken, refreshToken, expires_in });
        }
      )
    );

    this.express.use(passport.initialize());
    this.express.use(passport.session());
  }


  private configureMorgan() {
    this.express.use(morgan('tiny'));
  }
}

export default new App().express;
