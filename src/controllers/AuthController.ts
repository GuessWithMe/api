import Environment from '@env';
import { Handler } from 'express';

export const loginWithSpotify: Handler = (req, res): void => {
  return res.redirect(`${Environment.angularUrl}/game`);
};

export const checkIfAuthed: Handler = (req, res) => {
  return res.json({ authed: true });
};

/**
 * Log out and remove user from the player list
 */
export const logOut: Handler = (req, res): void => {
  req.session.destroy(() => {
    return res.status(204).json();
  });
};
