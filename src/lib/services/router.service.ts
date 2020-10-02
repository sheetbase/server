import {
  RouterExtending,
  RoutingMethod,
  RoutingHandler,
  RouteSet,
  RouteGroup,
  DisabledRoutes,
  DisabledRouteValue,
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

  register(items: unknown[], routeEnabling?: true | DisabledRoutes) {
    let moduleDisabledRoutes: DisabledRoutes = {};
    // register values
    for (let i = 0; i < items.length; i++) {
      // a group
      if (!(items[i] as Record<string, unknown>).endpoint) {
        const routeGroup = items[i] as RouteGroup;
        const {baseEndpoint, disabledRoutes} = routeGroup;
        // record disabled routes
        if (!!baseEndpoint && !!disabledRoutes) {
          moduleDisabledRoutes = {
            ...moduleDisabledRoutes,
            ...this.processDisabledRoutes(baseEndpoint, disabledRoutes),
          };
        }
        // router instance / metas (no disabled)
        const router = this.extend(routeGroup, true);
        // handler
        const methods = Object.getOwnPropertyNames(
          Object.getPrototypeOf(routeGroup)
        ).filter(x => x !== 'constructor');
        for (let j = 0; j < methods.length; j++) {
          const method = methods[j];
          const [routeMethod, routeEndpoint] = method
            .replace('__', ' /')
            .split(' ')
            .map(x => x.replace(/_/g, '/'));
          switch (routeMethod) {
            case 'ALL':
            case 'all':
              router.all(routeEndpoint, (req, res, next) =>
                (routeGroup[method] as RoutingHandler)(req, res, next)
              );
              break;
            case 'GET':
            case 'get':
              router.get(routeEndpoint, (req, res, next) =>
                (routeGroup[method] as RoutingHandler)(req, res, next)
              );
              break;
            case 'POST':
            case 'post':
              router.post(routeEndpoint, (req, res, next) =>
                (routeGroup[method] as RoutingHandler)(req, res, next)
              );
              break;
            case 'PUT':
            case 'put':
              router.put(routeEndpoint, (req, res, next) =>
                (routeGroup[method] as RoutingHandler)(req, res, next)
              );
              break;
            case 'PATCH':
            case 'patch':
              router.patch(routeEndpoint, (req, res, next) =>
                (routeGroup[method] as RoutingHandler)(req, res, next)
              );
              break;
            case 'DELETE':
            case 'delete':
              router.delete(routeEndpoint, (req, res, next) =>
                (routeGroup[method] as RoutingHandler)(req, res, next)
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
        const {endpoint, disabled, errors} = routeSet;
        // record disabled routes
        if (disabled) {
          moduleDisabledRoutes[endpoint] = disabled;
        }
        // metas
        if (errors) this.serverService.addRoutingErrors(errors);
        // handler
        if (!!routeSet.all && routeSet.all instanceof Function) {
          // all
          this.all(endpoint, (req, res, next) =>
            (routeSet.all as RoutingHandler)(req, res, next)
          );
        } else {
          // get
          if (!!routeSet.get && routeSet.get instanceof Function) {
            this.get(endpoint, (req, res, next) =>
              (routeSet.get as RoutingHandler)(req, res, next)
            );
          }
          // post
          if (!!routeSet.post && routeSet.post instanceof Function) {
            this.post(endpoint, (req, res, next) =>
              (routeSet.post as RoutingHandler)(req, res, next)
            );
          }
          // put
          if (!!routeSet.put && routeSet.put instanceof Function) {
            this.put(endpoint, (req, res, next) =>
              (routeSet.put as RoutingHandler)(req, res, next)
            );
          }
          // patch
          if (!!routeSet.patch && routeSet.patch instanceof Function) {
            this.patch(endpoint, (req, res, next) =>
              (routeSet.patch as RoutingHandler)(req, res, next)
            );
          }
          // delete
          if (!!routeSet.delete && routeSet.delete instanceof Function) {
            this.delete(endpoint, (req, res, next) =>
              (routeSet.delete as RoutingHandler)(req, res, next)
            );
          }
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
