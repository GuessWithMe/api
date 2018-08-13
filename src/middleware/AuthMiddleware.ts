import { NextFunction, Response, Request } from 'express';

export const isAuthenticated = async (
  req: Request, res: Response, next: NextFunction
): Promise<Response|void> => {
  try {
    console.log(req.session);
    if (req.session.user) {
    } else {
      throw new Error();
    }

    next();
  } catch (error) {
    return res.status(401).send({ error: 'Unauthorized' });
  }
};
