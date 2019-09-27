import {
  Options,
  DisabledRouteValue,
  DisabledRoutes,
  RoutingMethod,
  RoutingHandler,
  RoutingError,
  RoutingErrors,
  Routes,
  Middlewares,
  RouteMiddlewares,
} from './types';

export class Server {

  private options: Options;

  private routingErrors: RoutingErrors = {};
  private disabledRoutes: DisabledRoutes = {};

  private routes: Routes = {};
  private routeMiddlewares: RouteMiddlewares = {};
  private sharedMiddlewares: Middlewares = [];

  private methods: RoutingMethod[] = [
    'get', 'post', 'put', 'patch', 'delete',
  ];

  constructor(options: Options = {}) {
    this.options = {
      views: '',
      ...options,
    };
  }

  getOptions() {
    return this.options;
  }

  getRoutingErrors() {
    return this.routingErrors;
  }

  addRoutingError(code: string, error: RoutingError) {
    return this.routingErrors[code] = error;
  }

  addRoutingErrors(routingErrors: RoutingErrors) {
    return this.routingErrors = { ...this.routingErrors, ...routingErrors };
  }

  setRoutingErrors(routingErrors: RoutingErrors) {
    return this.routingErrors = routingErrors;
  }

  getDisabledRoutes() {
    return this.disabledRoutes;
  }

  addDisabledRoute(endpoint: string, value: DisabledRouteValue) {
    return this.disabledRoutes[endpoint] = value;
  }

  addDisabledRoutes(disabledRoutes: DisabledRoutes) {
    return this.disabledRoutes = { ...this.disabledRoutes, ...disabledRoutes };
  }

  setDisabledRoutes(disabledRoutes: DisabledRoutes) {
    return this.disabledRoutes = disabledRoutes;
  }

  isRouteDisabled(method: RoutingMethod, endpoint: string) {
    let isDisabled = false;
    const value = this.disabledRoutes[endpoint];
    if (
      !!value &&
      (
        value === '*' ||
        value.indexOf(method) !== -1
      )
    ) {
      isDisabled = true;
    }
    return isDisabled;
  }

  getMethods() {
    return this.methods;
  }

  isMethodValid(method: string) {
    return this.methods.indexOf(method as RoutingMethod) !== -1;
  }

  addSharedMiddlewares(middlewares: Middlewares) {
    return this.sharedMiddlewares = [
      ...this.sharedMiddlewares,
      ...middlewares,
    ];
  }

  setRouteHandler(
    method: RoutingMethod,
    endpoint: string,
    handler: RoutingHandler,
  ) {
    return this.routes[method + ':' + endpoint] = handler;
  }

  setRouteMiddlewares(
    method: RoutingMethod,
    endpoint: string,
    handlers: RoutingHandler[],
  ) {
    return this.routeMiddlewares[method + ':' + endpoint] = handlers;
  }

  addRoute(
    method: RoutingMethod,
    endpoint: string,
    handlers: RoutingHandler[],
  ) {
    this.setRouteHandler(method, endpoint, handlers.pop() as RoutingHandler);
    this.setRouteMiddlewares(method, endpoint, handlers);
  }

  setRouteHandlerAll(
    endpoint: string,
    handler: RoutingHandler,
  ) {
    for (const method of this.methods) {
      this.setRouteHandler(method, endpoint, handler);
    }
  }
  
  setRouteMiddlewaresAll(
    endpoint: string,
    handlers: RoutingHandler[],
  ) {
    for (const method of this.methods) {
      this.setRouteMiddlewares(method, endpoint, handlers);
    }
  }

  addRouteAll(
    endpoint: string,
    handlers: RoutingHandler[],
  ) {
    this.setRouteHandlerAll(endpoint, handlers.pop() as RoutingHandler);
    this.setRouteMiddlewaresAll(endpoint, handlers);
  }

  getRoute(method: RoutingMethod, endpoint: string) {
    const defaultHandler: RoutingHandler = (req, res) => {
      try {
        return res.render('errors/404');
      } catch (error) {
        return res.html(`
					<h1>404!</h1>
					<p>Not found.</p>
				`);
      }
    };
    // check if disabled
    if (this.isRouteDisabled(method, endpoint)) {
      return [defaultHandler];
    }
    // handler stack
    return [
      ...this.sharedMiddlewares,
      ...(this.routeMiddlewares[method + ':' + endpoint] || []),
      (this.routes[method + ':' + endpoint] || defaultHandler)
    ];
  }

  resolveEndpoint(...endpointSegments: string[]) {
    return ('/' + endpointSegments.join('/')).replace(/\/{2,}/g, '/');
  }

}