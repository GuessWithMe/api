import { Router } from 'express';
const router = Router();

import * as UserController from '@controllers/UserController';
import { isAuthenticated } from '@middleware/AuthMiddleware';

router.get('/playlists',
  isAuthenticated, UserController.getPlaylists
);

router.post('/import-from-playlist',
  isAuthenticated, UserController.importFromPlaylist
);

export default router;
