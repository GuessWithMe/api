import { Router } from 'express';
const router = Router();

import * as UserController from '@controllers/UserController';

router.get('/playlists',
  UserController.getPlaylists
);

router.post('/import-from-playlist',
  UserController.importFromPlaylist
);

export default router;
