import { Handler, Response } from 'express';

export const getCurrentUser: Handler = (req, res): Response => {
  try {
    return res.json(res.locals.user);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
