import {
  RouteInstance,
  DisabledRoutes,
  RoutingHandler,
  RoutingErrors,
} from './types';
import { ServerService } from './server';

export class RouterService {

  private baseEndpoint = '';

  constructor(private serverService: ServerService) {}

  extend() {
    return new RouterService(this.serverService);
  }

  config(routeInstance: RouteInstance) {
    const { baseEndpoint, routingErrors, disabledRoutes } = routeInstance;
    if (!!baseEndpoint) this.setEndpoint(baseEndpoint);
    if (!!routingErrors) this.setErrors(routingErrors);
    if (!!disabledRoutes) this.setDisabled(disabledRoutes);
    return this;
  }

  setEndpoint(endpoint: string) {
    this.baseEndpoint = endpoint;
    return this;
  }

  setErrors(errors: RoutingErrors) {
    this.serverService.addRoutingErrors(errors);
    return this;
  }

  setDisabled(disabled: DisabledRoutes) {
    this.serverService.addDisabledRoutes(disabled);
    return this;
  }

  buildEndpoint(segment: string) {
    return this.serverService.resolveEndpoint(this.baseEndpoint, segment);
  }

  use(...handlers: Array<string | RoutingHandler>) {
    return typeof handlers[0] === 'string'
      // for a route
      ? this.serverService.setRouteMiddlewaresAll(
          this.buildEndpoint(handlers.shift() as string),
          handlers as RoutingHandler[],
        )
      // for all routes
      : this.serverService.addSharedMiddlewares(handlers as RoutingHandler[]);
  }

  all(endpoint: string, ...handlers: RoutingHandler[]) {
    this.serverService.addRouteAll(this.buildEndpoint(endpoint), handlers);
  }

  get(endpoint: string, ...handlers: RoutingHandler[]) {
    this.serverService.addRoute('get', this.buildEndpoint(endpoint), handlers);
  }

  post(endpoint: string, ...handlers: RoutingHandler[]) {
    this.serverService.addRoute('post', this.buildEndpoint(endpoint), handlers);
  }

  put(endpoint: string, ...handlers: RoutingHandler[]) {
    this.serverService.addRoute('put', this.buildEndpoint(endpoint), handlers);
  }

  patch(endpoint: string, ...handlers: RoutingHandler[]) {
    this.serverService.addRoute('patch', this.buildEndpoint(endpoint), handlers);
  }

  delete(endpoint: string, ...handlers: RoutingHandler[]) {
    this.serverService.addRoute('delete', this.buildEndpoint(endpoint), handlers);
  }

}