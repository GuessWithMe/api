import { Sequelize } from 'sequelize-typescript';
import * as cors from 'cors';
import * as express from 'express'

import { SpotifyHelper } from './helpers/SpotifyHelper';

class App {
  public express: any;
  public corsOptions: object;

  constructor() {
    this.express = express();
    this.configureSequelize();
    this.configureCors();
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

    this.express.use('/', router);
  }

  private configureCors(): void {
    const corsOptions = {
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: 'http://localhost:4200',
      preflightContinue: false
    }

    this.express.use(cors(corsOptions));
    this.express.options("*", cors(corsOptions))
  }


  private configureSequelize(): void {
    const sequelize =  new Sequelize({
      database: 'song_thingy_dev',
      dialect: 'mysql',
      username: 'root',
      password: '',
      storage: ':memory:',
      modelPaths: [__dirname + '/models'],
      port: 13306
    });
  }
}

export default new App().express;
