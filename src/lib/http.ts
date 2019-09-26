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
    // execute
    const handlers = this.SERVER.getRoute(method, endpoint);
    const req = { query, body, data: {} } as RouteRequest;
    const res = this.RESPONSE;
    return this.execute(handlers, req, res);
  }

  private execute(
    handlers: RoutingHandler[],
    req: RouteRequest,
    res: RouteResponse
  ) {
    const handler = handlers.shift();
    if (!handler) {
      throw new Error('Invalid router handlers.');
    }
    if (handlers.length === 0) {
      return handler(req, res);
    } else {
      const next: RouteNext = (data = {}) => {
        if (!!data) {
          req.data = { ...req.data, ...data };
        }
        return this.execute(handlers, req, res);
      };
      return handler(req, res, next);
    }
  }

}