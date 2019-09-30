import {
  RouteInstance,
  DisabledRoutes,
  RoutingHandler,
  RoutingErrors,
} from './types';
import { Server } from './server';

export class Router {

  private SERVER: Server;

  private baseEndpoint = '';

  constructor(SERVER: Server) {
    this.SERVER = SERVER;
  }

  extend() {
    return new Router(this.SERVER);
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
    this.SERVER.addRoutingErrors(errors);
    return this;
  }

  setDisabled(disabled: DisabledRoutes) {
    this.SERVER.addDisabledRoutes(disabled);
    return this;
  }

  buildEndpoint(segment: string) {
    return this.SERVER.resolveEndpoint(this.baseEndpoint, segment);
  }

  use(...handlers: Array<string | RoutingHandler>) {
    return typeof handlers[0] === 'string'
      // for a route
      ? this.SERVER.setRouteMiddlewaresAll(
          this.buildEndpoint(handlers.shift() as string),
          handlers as RoutingHandler[],
        )
      // for all routes
      : this.SERVER.addSharedMiddlewares(handlers as RoutingHandler[]);
  }

  all(endpoint: string, ...handlers: RoutingHandler[]) {
    this.SERVER.addRouteAll(this.buildEndpoint(endpoint), handlers);
  }

  get(endpoint: string, ...handlers: RoutingHandler[]) {
    this.SERVER.addRoute('get', this.buildEndpoint(endpoint), handlers);
  }

  post(endpoint: string, ...handlers: RoutingHandler[]) {
    this.SERVER.addRoute('post', this.buildEndpoint(endpoint), handlers);
  }

  put(endpoint: string, ...handlers: RoutingHandler[]) {
    this.SERVER.addRoute('put', this.buildEndpoint(endpoint), handlers);
  }

  patch(endpoint: string, ...handlers: RoutingHandler[]) {
    this.SERVER.addRoute('patch', this.buildEndpoint(endpoint), handlers);
  }

  delete(endpoint: string, ...handlers: RoutingHandler[]) {
    this.SERVER.addRoute('delete', this.buildEndpoint(endpoint), handlers);
  }

}