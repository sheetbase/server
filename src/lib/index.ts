import {Options, DisabledRoutes} from './types';

import {ServerService} from './services/server.service';
import {ResponseService} from './services/response.service';
import {RouterService} from './services/router.service';
import {HttpService} from './services/http.service';
import {MonitoringService} from './services/monitoring.service';
import {APIKeyService} from './services/api-key.service';
import {MiddlewareService} from './services/middleware.service';

import {SystemRoute} from './routes/system.route';
import {LoggingRoute} from './routes/logging.route';

export class Lib {
  serverService: ServerService;
  responseService: ResponseService;
  routerService: RouterService;
  httpService: HttpService;
  monitoringService: MonitoringService;
  apiKeyService: APIKeyService;
  middlewareService: MiddlewareService;

  systemRoute: SystemRoute;
  loggingRoute: LoggingRoute;

  constructor(options?: Options) {
    // services
    this.serverService = new ServerService(options);
    this.responseService = new ResponseService(this.serverService);
    this.routerService = new RouterService(this.serverService);
    this.httpService = new HttpService(
      this.serverService,
      this.responseService
    );
    this.monitoringService = new MonitoringService();
    this.apiKeyService = new APIKeyService(this.serverService);
    this.middlewareService = new MiddlewareService(
      this.serverService,
      this.apiKeyService
    );
    // routes
    this.systemRoute = new SystemRoute();
    this.loggingRoute = new LoggingRoute(this.monitoringService);
  }

  /**
   * Expose the module routes
   */
  registerRoutes(routeEnabling?: true | DisabledRoutes) {
    return this.routerService.register(
      [this.systemRoute, this.loggingRoute],
      routeEnabling
    );
  }
}
