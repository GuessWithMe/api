import { Handler, Response } from 'express';

import { ActivePlayerHelper } from '@helpers/ActivePlayerHelper';
import GameService from '@services/Game.service';
import SocketService from '@services/Socket.service';
import * as SongDistributer from '@services/SongDistributer.service';

/**
 * Retrives the active song, time left and active player list.
 */
export const getStatus: Handler = async (req, res): Promise<Response> => {
  try {
    const status = SongDistributer.getStatus();
    let activePlayers = await ActivePlayerHelper.getActivePlayers();
    activePlayers = ActivePlayerHelper.filterActivePlayerListForClient(activePlayers);

    return res.json({ status, activePlayers });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const addActiveUser: Handler = async (req, res): Promise<Response> => {
  try {
    let activePlayers = await ActivePlayerHelper.getActivePlayers();

    if (!activePlayers) {
      activePlayers = {};
    }
    activePlayers[req.body.socketId] = res.locals.user;

    await ActivePlayerHelper.setActivePlayers(activePlayers);
    new SocketService().broadcastActivePlayerList(activePlayers);

    return res.json(activePlayers);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

/**
 * Removes user from the active player list
 */
export const removeActiveUser: Handler = async (req, res): Promise<Response> => {
  try {
    await GameService.removeActiveUser(req.body.socketId);
    return res.status(204);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const health: Handler = (req, res): Response => {
  return res.status(200).json({
    health: true
  });
};
