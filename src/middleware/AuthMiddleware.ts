import { NextFunction, Response, Request } from 'express';

export const isAuthenticated = async (
  req: Request, res: Response, next: NextFunction
): Promise<Response|void> => {
  try {
    if (req.session.user) {
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
};
