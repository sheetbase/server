import {
  RouterExtending,
  RoutingMethod,
  RoutingHandler,
  RouteSet,
  RouteGroup,
  DisabledRoutes,
  DisabledRouteValue,
  Middlewares,
  RouteMiddlewares,
} from '../types/server.type';
import {ServerService} from './server.service';

export class RouterService {
  private baseEndpoint = '';

  constructor(private serverService: ServerService) {}

  private endpoint(segment: string) {
    return this.serverService.resolveEndpoint(this.baseEndpoint, segment);
  }

  private processDisabledRoutes(
    baseEndpoint: string,
    disabledRoutes: DisabledRoutes
  ) {
    const result: DisabledRoutes = {};
    for (const endpoint of Object.keys(disabledRoutes)) {
      const value = disabledRoutes[endpoint];
      if (
        endpoint.substr(0, baseEndpoint.length) === baseEndpoint ||
        endpoint.substr(0, baseEndpoint.length + 1) === `/${baseEndpoint}`
      ) {
        result[endpoint] = value;
      } else {
        result[
          this.serverService.resolveEndpoint(baseEndpoint, endpoint)
        ] = value;
      }
    }
    return result;
  }

  private processRouteMiddlewares(
    customMiddlewares: Middlewares | RouteMiddlewares,
    localMiddlewares: Middlewares | RouteMiddlewares,
    classMethod: string,
    method: string,
    endpoint: string
  ) {
    let middlewares: Middlewares = [];
    // custom
    if (customMiddlewares instanceof Array) {
      middlewares = [...middlewares, ...customMiddlewares];
    } else {
      const id = method + ':' + endpoint;
      middlewares = [...middlewares, ...(customMiddlewares[id] || [])];
    }
    // local
    if (localMiddlewares instanceof Array) {
      middlewares = [...middlewares, ...localMiddlewares];
    } else {
      middlewares = [...middlewares, ...(localMiddlewares[classMethod] || [])];
    }
    return middlewares;
  }

  extend(configs: RouterExtending, ignoreDisabledRoutes = false) {
    const {baseEndpoint = '', routingErrors, disabledRoutes} = configs;
    const routerInstance = new RouterService(this.serverService);
    // base endpoint
    if (baseEndpoint) routerInstance.baseEndpoint = baseEndpoint;
    // metas
    if (routingErrors) this.serverService.addRoutingErrors(routingErrors);
    if (!ignoreDisabledRoutes && !!baseEndpoint && !!disabledRoutes) {
      this.serverService.addDisabledRoutes(
        this.processDisabledRoutes(baseEndpoint, disabledRoutes)
      );
    }
    // extended instance
    return routerInstance;
  }

  register(
    items: unknown[],
    routeEnabling?: true | DisabledRoutes,
    customMiddlewares: Middlewares | RouteMiddlewares = []
  ) {
    let moduleDisabledRoutes: DisabledRoutes = {};
    // register values
    for (let i = 0; i < items.length; i++) {
      const {middlewares: localMiddlewares = []} = items[i] as
        | RouteGroup
        | RouteSet;
      // a group
      if (!(items[i] as Record<string, unknown>).endpoint) {
        const routeGroup = items[i] as RouteGroup;
        const {baseEndpoint, disabledRoutes} = routeGroup;
        // router instance / metas (no disabled)
        const router = this.extend(routeGroup, true);
        // disabled
        if (!!baseEndpoint && !!disabledRoutes) {
          moduleDisabledRoutes = {
            ...moduleDisabledRoutes,
            ...this.processDisabledRoutes(baseEndpoint, disabledRoutes),
          };
        }
        // handler
        const classMethods = Object.getOwnPropertyNames(
          Object.getPrototypeOf(routeGroup)
        ).filter(x => x !== 'constructor');
        for (let j = 0; j < classMethods.length; j++) {
          const classMethod = classMethods[j];
          // method & endpoint
          const [routeMethod, routeEndpoint] = classMethod
            .replace('__', ' /')
            .split(' ')
            .map(x => x.replace(/_/g, '/'));
          // group middlewares
          const middlewares = this.processRouteMiddlewares(
            customMiddlewares,
            localMiddlewares,
            classMethod,
            routeMethod,
            routeEndpoint
          );
          // register
          switch (routeMethod) {
            case 'ALL':
            case 'all':
              router.all(routeEndpoint, ...middlewares, (req, res, next) =>
                (routeGroup[classMethod] as RoutingHandler)(req, res, next)
              );
              break;
            case 'GET':
            case 'get':
              router.get(routeEndpoint, ...middlewares, (req, res, next) =>
                (routeGroup[classMethod] as RoutingHandler)(req, res, next)
              );
              break;
            case 'POST':
            case 'post':
              router.post(routeEndpoint, ...middlewares, (req, res, next) =>
                (routeGroup[classMethod] as RoutingHandler)(req, res, next)
              );
              break;
            case 'PUT':
            case 'put':
              router.put(routeEndpoint, ...middlewares, (req, res, next) =>
                (routeGroup[classMethod] as RoutingHandler)(req, res, next)
              );
              break;
            case 'PATCH':
            case 'patch':
              router.patch(routeEndpoint, ...middlewares, (req, res, next) =>
                (routeGroup[classMethod] as RoutingHandler)(req, res, next)
              );
              break;
            case 'DELETE':
            case 'delete':
              router.delete(routeEndpoint, ...middlewares, (req, res, next) =>
                (routeGroup[classMethod] as RoutingHandler)(req, res, next)
              );
              break;
            default:
              break;
          }
        }
      }
      // a set
      else {
        const routeSet = items[i] as RouteSet;
        const {endpoint: routeEndpoint, disabled, errors} = routeSet;
        // disabled
        if (disabled) {
          moduleDisabledRoutes[routeEndpoint] = disabled;
        }
        // errors
        if (errors) this.serverService.addRoutingErrors(errors);
        // handler
        const classMethod: string =
          !!routeSet.all && routeSet.all instanceof Function
            ? 'all'
            : !!routeSet.get && routeSet.get instanceof Function
            ? 'get'
            : !!routeSet.post && routeSet.post instanceof Function
            ? 'post'
            : !!routeSet.put && routeSet.put instanceof Function
            ? 'put'
            : !!routeSet.patch && routeSet.patch instanceof Function
            ? 'patch'
            : !!routeSet.delete && routeSet.delete instanceof Function
            ? 'delete'
            : 'none';
        const routeMethod = classMethod;
        // set middlewares
        const middlewares = this.processRouteMiddlewares(
          customMiddlewares,
          localMiddlewares,
          classMethod,
          routeMethod,
          routeEndpoint
        );
        // register
        switch (routeMethod) {
          case 'all':
            this.all(routeEndpoint, ...middlewares, (req, res, next) =>
              (routeSet.all as RoutingHandler)(req, res, next)
            );
            break;
          case 'get':
            this.get(routeEndpoint, ...middlewares, (req, res, next) =>
              (routeSet.get as RoutingHandler)(req, res, next)
            );
            break;
          case 'post':
            this.post(routeEndpoint, ...middlewares, (req, res, next) =>
              (routeSet.post as RoutingHandler)(req, res, next)
            );
            break;
          case 'put':
            this.put(routeEndpoint, ...middlewares, (req, res, next) =>
              (routeSet.put as RoutingHandler)(req, res, next)
            );
            break;
          case 'patch':
            this.patch(routeEndpoint, ...middlewares, (req, res, next) =>
              (routeSet.patch as RoutingHandler)(req, res, next)
            );
            break;
          case 'delete':
            this.delete(routeEndpoint, ...middlewares, (req, res, next) =>
              (routeSet.delete as RoutingHandler)(req, res, next)
            );
            break;
          default:
            break;
        }
      }
    }
    // process enabled routes
    if (routeEnabling) {
      if (routeEnabling === true) {
        moduleDisabledRoutes = {};
      } else {
        for (const endpoint of Object.keys(routeEnabling)) {
          const enabledValue = routeEnabling[endpoint];
          const currentValue = moduleDisabledRoutes[endpoint];
          if (!!enabledValue && !!currentValue) {
            // all
            if (enabledValue === '*') {
              delete moduleDisabledRoutes[endpoint];
            } else {
              const value: DisabledRouteValue =
                currentValue === '*'
                  ? ([
                      'get',
                      'post',
                      'put',
                      'patch',
                      'delete',
                    ] as RoutingMethod[])
                  : currentValue;
              moduleDisabledRoutes[endpoint] = value.filter(
                x => !enabledValue.includes(x)
              );
            }
          }
        }
      }
    }
    // add disabled routes
    this.serverService.addDisabledRoutes(moduleDisabledRoutes);
    // done
    return this;
  }

  use(...handlers: Array<string | RoutingHandler>) {
    return typeof handlers[0] === 'string'
      ? // for a route
        this.serverService.setRouteMiddlewaresAll(
          this.endpoint(handlers.shift() as string),
          handlers as RoutingHandler[]
        )
      : // for all routes
        this.serverService.addSharedMiddlewares(handlers as RoutingHandler[]);
  }

  all(endpoint: string, ...handlers: RoutingHandler[]) {
    this.serverService.addRouteAll(this.endpoint(endpoint), handlers);
  }

  get(endpoint: string, ...handlers: RoutingHandler[]) {
    this.serverService.addRoute('get', this.endpoint(endpoint), handlers);
  }

  post(endpoint: string, ...handlers: RoutingHandler[]) {
    this.serverService.addRoute('post', this.endpoint(endpoint), handlers);
  }

  put(endpoint: string, ...handlers: RoutingHandler[]) {
    this.serverService.addRoute('put', this.endpoint(endpoint), handlers);
  }

  patch(endpoint: string, ...handlers: RoutingHandler[]) {
    this.serverService.addRoute('patch', this.endpoint(endpoint), handlers);
  }

  delete(endpoint: string, ...handlers: RoutingHandler[]) {
    this.serverService.addRoute('delete', this.endpoint(endpoint), handlers);
  }
}
