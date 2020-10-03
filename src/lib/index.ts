import {Options, DisabledRoutes} from './types/server.type';

import {OptionService} from './services/option.service';
import {ServerService} from './services/server.service';
import {ResponseService} from './services/response.service';
import {RouterService} from './services/router.service';
import {HttpService} from './services/http.service';
import {MonitoringService} from './services/monitoring.service';
import {APIKeyService} from './services/api-key.service';

import {APIKeyMiddleware} from './middlewares/api-key.middleware';

import {SystemRoute} from './routes/system.route';
import {LoggingRoute} from './routes/logging.route';

export class Lib {
  optionService: OptionService;
  serverService: ServerService;
  responseService: ResponseService;
  routerService: RouterService;
  httpService: HttpService;
  monitoringService: MonitoringService;
  apiKeyService: APIKeyService;
  apiKeyMiddleware: APIKeyMiddleware;
  systemRoute: SystemRoute;
  loggingRoute: LoggingRoute;

  constructor(options: Options = {}) {
    // services
    this.optionService = new OptionService(options);
    this.serverService = new ServerService();
    this.responseService = new ResponseService(
      this.optionService,
      this.serverService
    );
    this.routerService = new RouterService(this.serverService);
    this.httpService = new HttpService(
      this.serverService,
      this.responseService
    );
    this.monitoringService = new MonitoringService();
    this.apiKeyService = new APIKeyService(this.optionService);
    // middlewares
    this.apiKeyMiddleware = new APIKeyMiddleware(
      this.optionService,
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
