import { Sequelize } from 'sequelize-typescript';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import cors from 'cors';
import express from 'express'
import session from 'express-session';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
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
    this.configureExpressSession();
    this.setupPassport(passport);
    this.configureMorgan();

    this.mountRoutes();
  }


  private mountRoutes(): void {
    const router = express.Router()
    this.express.use('/users', UserRoutes);
    this.express.use('/auth', AuthRoutes);
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
        (accessToken, refreshToken, expires_in, profile, done) => {
          let imageUrl;
          if (profile.photos.length > 0) {
            imageUrl = profile.photos[0];
          }

          User.findOrCreate({
            where: {
              spotifyId: profile.id,
            },
            defaults: {
              spotifyUsername: profile.username,
              spotifyAccessToken: accessToken,
              spotifyRefreshToken: refreshToken,
              spotifyDisplayName: profile.displayName,
              spotifyImageUrl: imageUrl,
            }
          }).then((user) => {
            return done(undefined, user);
          })
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
