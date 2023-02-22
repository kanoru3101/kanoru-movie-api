import { User } from '@models';
import type { RequestHandler } from 'express'
import { IncomingMessage } from 'http';
import * as authService from '@services/auth'

export type ReqUser = Pick<User, 'id' | 'email'>

declare module 'http' {
  interface IncomingMessage {
    user?: ReqUser | null;
  }
}

const getUserFromToken = ({ token }: { token?: string}): ReqUser | null => {
  if (!token) {
    return null;
  }

  return authService.verifyJWT({ token });
}



const authMiddleware: RequestHandler = (req, _res, next) => {
  const token = req.cookies?.auth;
  req.user = getUserFromToken({ token });

  next()
}

export default authMiddleware
