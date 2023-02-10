import { RequestHandler, Request, Response, NextFunction } from "express";

type Handler<P, ResBody, ReqBody, ReqQuery> = (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
) => void | Promise<void>;

const routeHandler = <
Params,
ResBody,
ReqBody,
ReqQuery,
>(handler: Handler<Params, ResBody, ReqBody, ReqQuery>): RequestHandler<Params, ResBody, ReqBody, ReqQuery> => async (
  req: Request<Params, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction,
): Promise<void>  => {
  try {
    await handler(req, res);
  } catch (error) {
    next(error);
  }
}

export default routeHandler;
