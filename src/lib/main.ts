import { Options } from './types';

import { Server } from './server';
import { Request } from './request';
import { Response } from './response';
import { Router } from './router';
import { Http } from './http';
import { Monitoring } from './monitoring';
import { APIKey } from './api-key';
import { Middleware } from './middleware';
import { Route } from './route';

export class Main {
  
  private SERVER: Server;
  private REQUEST: Request;
  private RESPONSE: Response;
  private ROUTER: Router;
  private HTTP: Http;
  private MONITORING: Monitoring;
  private API_KEY: APIKey;
  private MIDDLEWARE: Middleware;
  private ROUTE: Route;

  constructor(options?: Options) {
    this.SERVER = new Server(options);
    this.REQUEST = new Request();
    this.RESPONSE = new Response(this.SERVER);
    this.ROUTER = new Router(this.SERVER);
    this.HTTP = new Http(this.SERVER, this.REQUEST, this.RESPONSE);
    this.MONITORING = new Monitoring();
    this.API_KEY = new APIKey(this.SERVER);
    this.MIDDLEWARE = new Middleware(this.SERVER, this.API_KEY);
    this.ROUTE = new Route(this.ROUTER, this.MONITORING);
  }

  router() {
    return this.ROUTER;
  }

  http() {
    return this.HTTP;
  }

  monitoring() {
    return this.MONITORING;
  }

  registerRoutes() {
    return this.ROUTE.registerRoutes();
  }

  apiKeyMiddleware() {
    return this.MIDDLEWARE.apiKeyMiddleware();
  }

}