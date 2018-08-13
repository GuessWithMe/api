import { Request, Response } from 'express';

export async function loginWithSpotify(req: Request, res: Response): Promise<void> {
  req.session.user = req.user;
  return res.redirect('http://localhost:4200/game');
}


export async function logOut(req: Request, res: Response): Promise<Response | void> {
  req.session.destroy(() => {
    return res.status(204).json();
  });
}

