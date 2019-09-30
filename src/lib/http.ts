import {
  HttpMethod,
  HttpEvent,
  RouteRequest,
  RouteResponse,
  RouteNext,
  RoutingMethod,
  RoutingHandler,
} from './types';

import { Server } from './server';
import { Response } from './response';

export class Http {

  private SERVER: Server;
  private RESPONSE: Response;

  constructor(
    SERVER: Server,
    RESPONSE: Response,
  ) {
    this.SERVER = SERVER;
    this.RESPONSE = RESPONSE;
  }

  get(e: HttpEvent) {
    return this.handler('get', e);
  }

  post(e: HttpEvent) {
    return this.handler('post', e);
  }

  extractQuery(httpEvent: HttpEvent) {
    return httpEvent.parameter || {};
  }

  extractBody(httpEvent: HttpEvent) {
    const { body: encodedBody } = this.extractQuery(httpEvent);
    const queryBody = !!encodedBody
      ? JSON.parse(decodeURIComponent(encodedBody))
      : {};
    const nativeBody = httpEvent.postData && httpEvent.postData.contents
      ? JSON.parse(httpEvent.postData.contents)
      : {};
    return { ...queryBody, ...nativeBody };
  }

  getMethod(httpMethod: HttpMethod, customMethod?: RoutingMethod) {
    return !!customMethod && this.SERVER.isMethodValid(customMethod)
      ? customMethod
      : httpMethod;
  }

  getEndpoint(eParam = '') {
    return this.SERVER.resolveEndpoint(eParam);
  }

  handler(httpMethod: HttpMethod, httpEvent: HttpEvent) {
    // retrieve data
    const query = this.extractQuery(httpEvent);
    const body = this.extractBody(httpEvent);
    // get handlers
    const handlers = this.SERVER.getRoute(
      this.getMethod(httpMethod, query.method),
      this.getEndpoint(query.e),
    );
    // req & res
    const req = { query, body, data: {} } as RouteRequest;
    const res = this.RESPONSE as RouteResponse;
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
      return res.error(error.message);
    }
  }

  execute(
    handlers: RoutingHandler[],
    req: RouteRequest,
    res: RouteResponse
  ) {
    const handler = handlers.shift() as RoutingHandler;
    if (handlers.length === 0) {
      return handler(req, res, () => { throw new Error('No more handler.') });
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