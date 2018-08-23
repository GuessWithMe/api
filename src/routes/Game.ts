import { Router } from 'express';
const router = Router();

import * as GameController from '@controllers/GameController';
import { isAuthenticated } from '@middleware/AuthMiddleware';

router.get('/current-song',
  isAuthenticated, GameController.getCurrentSong
);

export default router;
