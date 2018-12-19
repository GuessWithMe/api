import { Router } from 'express';
// import * as passport from 'passport';
const passport = require('passport');
// import { Strategy as SpotifyStrategy } from 'passport-spotify';
// const SpotifyStrategy = require('passport-spotify').Strategy;

import Environment from '@env';
import * as AuthController from '@controllers/AuthController';

const router = Router();

import { User } from '@models';
import { isAuthenticated } from '@middleware/AuthMiddleware';


router.get('/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/auth/login' }),
  AuthController.loginWithSpotify
);

router.get('/spotify', passport.authenticate('spotify'));

router.get('/check', isAuthenticated, AuthController.checkIfAuthed);

router.get('/logout', AuthController.logOut);

// router.get('/login',
//   AuthController.loginWithSpotify
// );

export default router;
