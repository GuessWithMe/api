import { Request, Response } from 'express';
import Environment from '@env';


export async function loginWithSpotify(req: Request, res: Response): Promise<void> {
  return res.redirect(`${Environment.angularUrl}/game`);
}


export async function checkIfAuthed(req: Request, res: Response): Promise<Response> {
  return res.json({ authed: true });
}


export async function logOut(req: Request, res: Response): Promise<Response | void> {
  req.session.destroy(() => {
    return res.status(204).json();
  });
}

