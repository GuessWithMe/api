import * as express from 'express'
import { SpotifyHelper } from './helpers/SpotifyHelper';
import * as cors from 'cors';

class App {
  public express: any;
  public corsOptions: object;

  constructor() {
    this.express = express();
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
}

export default new App().express;
