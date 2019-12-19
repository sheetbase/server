import { Options } from './types';
import { ServerService } from './server';
import { ResponseService } from './response';
import { RouterService } from './router';
import { HttpService } from './http';
import { MonitoringService } from './monitoring';
import { APIKeyService } from './api-key';
import { MiddlewareService } from './middleware';
import { RouteService } from './route';

export class Main {

  serverService: ServerService;
  responseService: ResponseService;
  routerService: RouterService;
  httpService: HttpService;
  monitoringService: MonitoringService;
  apiKeyService: APIKeyService;
  middlewareService: MiddlewareService;
  routeService: RouteService;

  constructor(options?: Options) {
    // main
    this.serverService = new ServerService(options);
    // members
    this.responseService = new ResponseService(this.serverService);
    this.routerService = new RouterService(this.serverService);
    this.httpService = new HttpService(
      this.serverService,
      this.responseService
    );
    this.monitoringService = new MonitoringService();
    this.apiKeyService = new APIKeyService(this.serverService);
    // routing
    this.middlewareService = new MiddlewareService(
      this.serverService,
      this.apiKeyService
    );
    this.routeService = new RouteService(
      this.routerService,
      this.monitoringService,
    );
  }

  /**
   * Expose the module routes
   */
  registerRoutes() {
    return this.routeService.registerRoutes();
  }

}