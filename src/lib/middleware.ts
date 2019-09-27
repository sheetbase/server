import { RouteRequest, RouteResponse, RouteNext, RoutingHandler } from './types';
import { Server } from './server';
import { APIKey } from './api-key';

export class Middleware {

  private SERVER: Server;
  private API_KEY: APIKey;

  constructor(
    SERVER: Server,
    API_KEY: APIKey,
  ) {
    this.SERVER = SERVER;
    this.API_KEY = API_KEY;
  }

  apiKey() {
    return (
      (
        req: RouteRequest,
        res: RouteResponse,
        next: RouteNext
      ) => {
        const { trigger, failure } = this.SERVER.getOptions();
        // get the api key object
        const apiKey = this.API_KEY.getApiKey(req.body.key || req.query.key);
        // invalid
        if (!apiKey) {
          if (failure && failure instanceof Function) {
            return failure(req, res);
          } else {
            try {
              return res.render('errors/403');
            } catch (error) {
              return res.html('<h1>403!</h1><p>Unauthorized.</p>');
            }
          }
        }
        // emit event
        if (trigger && trigger instanceof Function) {
          trigger(req, apiKey);
        }
        // process next
        return next();
      }
    ) as RoutingHandler;
  }

}