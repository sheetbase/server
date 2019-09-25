import { HttpEvent, RouteRequest, RouteResponse, RouteHandler } from './types';

import { OptionService } from './option';
import { ResponseService } from './response';
import { RouterService } from './router';

export class HttpService {
  private optionService: OptionService;
  private responseService: ResponseService;
  private routerService: RouterService;

  private allowedMethods: string[] = [
    'GET', 'POST', 'PUT', 'PATCH', 'DELETE',
  ];

  constructor(
    optionService: OptionService,
    responseService: ResponseService,
    routerService: RouterService,
  ) {
    this.optionService = optionService;
    this.responseService = responseService;
    this.routerService = routerService;
  }

  get(e: HttpEvent) {
    return this.http(e, 'GET');
  }

  post(e: HttpEvent) {
    return this.http(e, 'POST');
  }

  private http(e: HttpEvent, method = 'GET') {
    let endpoint: string = (e.parameter || {}).e || '';
    if (endpoint.substr(0, 1) !== '/') { endpoint = '/' + endpoint; }
    // methods
    const originalMethod = method;
    const allowMethodsWhenDoGet: boolean = this.optionService.get('allowMethodsWhenDoGet');
    if (method !== 'GET' || (method === 'GET' && allowMethodsWhenDoGet)) {
      const useMeMethod: string = (e.parameter || {}).method;
      method = useMeMethod ? useMeMethod.toUpperCase() : method;
      method = (this.allowedMethods.indexOf(method) < 0) ? originalMethod : method;
    }
    // request object
    const req: RouteRequest = {
      query: e.parameter || {},
      params: e.parameter || {},
      body: {},
      data: {},
    };
    // body
    if (method === 'GET' && allowMethodsWhenDoGet) {
      try {
        req.body = JSON.parse((e.parameter || {}).body || '{}');
      } catch (error) {
        req.body = {};
      }
    } else {
      req.body = JSON.parse(e.postData ? e.postData.contents : '{}');
    }
    // response object
    const res: RouteResponse = this.responseService;
    // execute handlers
    const handlers: RouteHandler[] = this.routerService.route(method, endpoint);
    return this.execute(handlers, req, res);
  }

  private execute(handlers: RouteHandler[], req: RouteRequest, res: RouteResponse) {
    const handler: RouteHandler = handlers.shift();
    if (!handler) {
      throw new Error('Invalid router handler!');
    }
    if (handlers.length < 1) {
      return handler(req, res);
    } else {
      const next = (data: any) => {
        if (data) {
          if (!(data instanceof Object)) {
            data = { value: data };
          }
          req.data = { ... (req.data || {}), ... (data || {}) };
        }
        return this.execute(handlers, req, res);
      };
      return handler(req, res, next);
    }
  }
}