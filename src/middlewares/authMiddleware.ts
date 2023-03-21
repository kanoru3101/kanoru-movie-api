import { User } from '@models';
import type { RequestHandler } from 'express'
import { IncomingMessage } from 'http';
import * as authService from '@services/auth'
import * as userController from "@controllers/user";

export type ReqUser = Pick<User, 'id' | 'email' | 'name' | 'slug' | 'logo' | 'language'>
export type ReqUserToken = Pick<User, 'id' | 'email'>

declare module 'http' {
  interface IncomingMessage {
    user?: ReqUser | null;
  }
}

const getUserFromToken = ({ token }: { token?: string}): ReqUserToken | null => {
  if (!token) {
    return null;
  }

  return authService.verifyJWT({ token });
}



const authMiddleware: RequestHandler = async (req, _res, next) => {
  const token = req.cookies?.auth;
  const userToken = getUserFromToken({ token });

  if (userToken) {
    req.user = await userController.getUser({ userId: userToken.id })
  } else {
    req.user = null
  }

  next()
}

export default authMiddleware
