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
    // main
    this.SERVER = new Server(options);
    // members
    this.REQUEST = new Request();
    this.RESPONSE = new Response(this.SERVER);
    this.ROUTER = new Router(this.SERVER);
    this.HTTP = new Http(this.SERVER, this.REQUEST, this.RESPONSE);
    this.MONITORING = new Monitoring();
    this.API_KEY = new APIKey(this.SERVER);
    // routing
    this.MIDDLEWARE = new Middleware(this.SERVER, this.API_KEY);
    this.ROUTE = new Route(this.MONITORING);
  }

  /**
   * Get the Server instance
   */
  server() {
    return this.SERVER;
  }

  /**
   * Get the Router instance
   */
  router() {
    return this.ROUTER;
  }

  /**
   * Get the Http instance
   */
  http() {
    return this.HTTP;
  }

  /**
   * Get the Monitoring instance
   */
  monitoring() {
    return this.MONITORING;
  }

  /**
   * Expose the module routes
   */
  registerRoutes() {
    return this.ROUTE.registerRoutes(this.ROUTER);
  }

  /**
   * Get the api key middleware
   */
  apiKeyMiddleware() {
    return this.MIDDLEWARE.apiKey();
  }

}