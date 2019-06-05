import { NextFunction, Request, Response } from 'express';

import { User } from '@models';

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    if (req.session.passport.user) {
      res.locals.user = await User.findByPk(req.session.passport.user.id);
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
};

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    if (req.session.passport.user.spotifyUsername === 'mistak3nlv') {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
};
