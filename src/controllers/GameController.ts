import { Request, Response } from 'express';

import { ActivePlayerHelper } from '@helpers/ActivePlayerHelper';
import * as SongDistributer from '@services/SongDistributer.service';
import GameService from '@services/Game.service';
import SocketService from "@services/Socket.service";

export async function getStatus(req: Request, res: Response): Promise<Response> {
  try {
    const status = SongDistributer.getStatus();
    return res.json(status);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}


export async function addActiveUser(req: Request, res: Response): Promise<Response> {
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
}


export async function removeActiveUser(req: Request, res: Response): Promise<Response> {
  try {
    await GameService.removeActiveUser(req.body.socketId);
    return res.status(204);
  } catch (error) {
    return res.status(500).json(error.message);
  }
}
