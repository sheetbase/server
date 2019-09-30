import {
  HttpMethod,
  HttpEvent,
  RouteRequest,
  RouteResponse,
  RoutingHandler,
  RouteNext,
} from './types';

import { Server } from './server';
import { Request } from './request';
import { Response } from './response';

export class Http {

  private SERVER: Server;
  private REQUEST: Request;
  private RESPONSE: Response;

  constructor(
    SERVER: Server,
    REQUEST: Request,
    RESPONSE: Response,
  ) {
    this.SERVER = SERVER;
    this.REQUEST = REQUEST;
    this.RESPONSE = RESPONSE;
  }

  get(e: HttpEvent) {
    return this.handler('get', e);
  }

  post(e: HttpEvent) {
    return this.handler('post', e);
  }

  private extractQuery(httpEvent: HttpEvent) {
    return this.REQUEST.query(httpEvent);
  }

  private extractBody(httpEvent: HttpEvent) {
    const { body: encodedBody } = this.extractQuery(httpEvent);
    return !!encodedBody
      ? JSON.parse(decodeURIComponent(encodedBody))
      : this.REQUEST.body(httpEvent);
  }

  private extractEndpoint(httpEvent: HttpEvent) {
    const { e: endpoint = '' } = this.extractQuery(httpEvent);
    return this.SERVER.resolveEndpoint(endpoint);
  }

  private extractMethod(httpMethod: HttpMethod, httpEvent: HttpEvent) {
    const { method: customMethod } = this.extractQuery(httpEvent);
    return (
        !!customMethod &&
        this.SERVER.isMethodValid(customMethod)
      )
      ? customMethod
      : httpMethod;
  }

  private handler(httpMethod: HttpMethod, httpEvent: HttpEvent) {
    // retrieve data
    const query = this.extractQuery(httpEvent);
    const body = this.extractBody(httpEvent);
    const endpoint = this.extractEndpoint(httpEvent);
    const method = this.extractMethod(httpMethod, httpEvent);
    // get handlers
    const handlers = this.SERVER.getRoute(method, endpoint);
    // req & res
    const req = { query, body, data: {} } as RouteRequest;
    const res = this.RESPONSE;
    // execute
    try {
      const result = this.execute(handlers, req, res);
      if (!result) {
        return res.done(); // direct returns, empty result
      } else if (typeof result === 'string') {
        return res.html(result); // direct returns, a string
      } else if (!result.getContent) {
        return res.success(result); // direct returns, json data
      } else {
        return result; // TextOutput or HtmlOutput
      }
    } catch (error) {
      return res.error(error);
    }
  }

  private execute(
    handlers: RoutingHandler[],
    req: RouteRequest,
    res: RouteResponse
  ) {
    const handler = handlers.shift() as RoutingHandler;
    if (handlers.length === 0) {
      return handler(req, res, () => { throw new Error('No next().') });
    } else {
      const next: RouteNext = data => {
        if (!!data) {
          req.data = { ...req.data, ...data };
        }
        return this.execute(handlers, req, res);
      };
      return handler(req, res, next);
    }
  }

}