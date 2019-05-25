import { Router } from 'express';
const router = Router();

import * as GameController from '@controllers/GameController';
import * as AdminController from '@controllers/AdminController';
import { isAuthenticated, isAdmin } from '@middleware/AuthMiddleware';

router.get('/truncate',
  isAuthenticated, isAdmin, AdminController.truncateDatabase
);


export default router;
