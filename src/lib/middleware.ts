import { RouteRequest, RouteResponse, RouteNext, RoutingHandler } from './types';
import { ServerService } from './server';
import { APIKeyService } from './api-key';

export class MiddlewareService {

  constructor(
    private serverService: ServerService,
    private apiKeyService: APIKeyService,
  ) {}

  apiKey() {
    return (
      (
        req: RouteRequest,
        res: RouteResponse,
        next: RouteNext
      ) => {
        const { trigger, failure } = this.serverService.getOptions();
        // get the api key object
        const apiKey = this.apiKeyService.getApiKey(req.body.key || req.query.key);
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