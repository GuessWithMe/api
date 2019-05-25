import { Router } from 'express';
const router = Router();

import * as PlaylistController from '@controllers/PlaylistController';
import { isAuthenticated } from '@middleware/AuthMiddleware';

router.get('/', isAuthenticated, PlaylistController.getPlaylists);
router.post('/import', isAuthenticated, PlaylistController.importPlaylist);

export default router;
