import { Router } from 'express';
// import * as passport from 'passport';
const passport = require('passport');
// import { Strategy as SpotifyStrategy } from 'passport-spotify';
// const SpotifyStrategy = require('passport-spotify').Strategy;

import Environment from '@env';
import * as AuthController from '@controllers/AuthController';

const router = Router();

import { User } from '@models/User';


router.get('/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/auth/login' }),
  AuthController.loginWithSpotify
);

router.get('/spotify', passport.authenticate('spotify'));

// router.get('/login',
//   AuthController.loginWithSpotify
// );

export default router;