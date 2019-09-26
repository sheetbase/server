import { RouteInstance, DisabledRoutes, RoutingHandler, RoutingErrors } from './types';
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

  use(...handlers: Array<string | RoutingHandler>) {
    return typeof handlers[0] === 'string'
      // for a route
      ? this.SERVER.setRouteMiddlewaresAll(
          this.SERVER.resolveEndpoint(handlers.shift() as string, this.baseEndpoint),
          handlers as RoutingHandler[],
        )
      // for all routes
      : this.SERVER.addSharedMiddlewares(handlers as RoutingHandler[]);
  }

  all(endpoint: string, ...handlers: RoutingHandler[]) {
    this.SERVER.addRouteAll(
      this.SERVER.resolveEndpoint(endpoint, this.baseEndpoint),
      handlers,
    );
  }

  get(endpoint: string, ...handlers: RoutingHandler[]) {
    this.SERVER.addRoute('get',
      this.SERVER.resolveEndpoint(endpoint, this.baseEndpoint), handlers);
  }

  post(endpoint: string, ...handlers: RoutingHandler[]) {
    this.SERVER.addRoute('post',
      this.SERVER.resolveEndpoint(endpoint, this.baseEndpoint), handlers);
  }

  put(endpoint: string, ...handlers: RoutingHandler[]) {
    this.SERVER.addRoute('put',
      this.SERVER.resolveEndpoint(endpoint, this.baseEndpoint), handlers);
  }

  patch(endpoint: string, ...handlers: RoutingHandler[]) {
    this.SERVER.addRoute('patch',
      this.SERVER.resolveEndpoint(endpoint, this.baseEndpoint), handlers);
  }

  delete(endpoint: string, ...handlers: RoutingHandler[]) {
    this.SERVER.addRoute('delete',
      this.SERVER.resolveEndpoint(endpoint, this.baseEndpoint), handlers);
  }

}