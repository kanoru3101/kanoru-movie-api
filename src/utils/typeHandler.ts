import { Request } from 'express'

type TypeRequest = {
  query: unknown
  body: unknown
  params: unknown
  response: unknown
}

type Handler<Params, Res, Body, ReqQuery> = Request<Params, Res, Body, ReqQuery>

type TypeHandler<T extends TypeRequest> = Handler<
  T['params'],
  T['response'],
  T['body'],
  T['query']
>

export default TypeHandler;
