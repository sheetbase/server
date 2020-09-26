import {RouteRequest, RouteResponse, RouteNext, RoutingHandler} from '../types';
import {ServerService} from './server.service';
import {APIKeyService} from './api-key.service';

export class MiddlewareService {
  constructor(
    private serverService: ServerService,
    private apiKeyService: APIKeyService
  ) {}

  apiKey() {
    return ((req: RouteRequest, res: RouteResponse, next: RouteNext) => {
      const {trigger, failure} = this.serverService.getOptions();
      // get the api key object
      const apiKey = this.apiKeyService.getApiKey(
        req.body.key || req.query.key
      );
      // invalid
      if (!apiKey) {
        if (failure && failure instanceof Function) {
          return failure(req, res);
        } else {
          return res.oops('403');
        }
      }
      // emit event
      if (trigger && trigger instanceof Function) {
        trigger(req, apiKey);
      }
      // process next
      return next();
    }) as RoutingHandler;
  }
}
