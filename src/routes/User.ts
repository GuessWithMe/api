import { Router } from 'express';
const router = Router();

import * as UserController from '@controllers/UserController';
import { isAuthenticated } from '@middleware/AuthMiddleware';

router.get('/current',
  isAuthenticated, UserController.getCurrentUser
);

export default router;
