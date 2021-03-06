import {
  HttpMethod,
  HttpEvent,
  RouteRequest,
  RouteResponse,
  RouteNext,
  RoutingMethod,
  RoutingHandler,
  RoutingResult,
} from '../types/server.type';
import {ServerService} from './server.service';
import {ResponseService} from './response.service';

export class HttpService {
  constructor(
    private serverService: ServerService,
    private responseService: ResponseService
  ) {}

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
    const {body: encodedBody} = this.extractQuery(httpEvent);
    const queryBody = encodedBody
      ? JSON.parse(decodeURIComponent(encodedBody))
      : {};
    const nativeBody =
      httpEvent.postData && httpEvent.postData.contents
        ? JSON.parse(httpEvent.postData.contents)
        : {};
    return {...queryBody, ...nativeBody};
  }

  getMethod(httpMethod: HttpMethod, customMethod?: RoutingMethod) {
    return !!customMethod && this.serverService.isMethodValid(customMethod)
      ? customMethod
      : httpMethod;
  }

  getEndpoint(eParam = '') {
    return this.serverService.resolveEndpoint(eParam);
  }

  handler(httpMethod: HttpMethod, httpEvent: HttpEvent) {
    // retrieve data
    const query = this.extractQuery(httpEvent);
    const body = this.extractBody(httpEvent);
    // get handlers
    const handlers = this.serverService.getRoute(
      this.getMethod(httpMethod, query.method),
      this.getEndpoint(query.e)
    );
    // req & res
    const req = {query, body, data: {}} as RouteRequest;
    const res = this.responseService as RouteResponse;
    // execute
    try {
      const result = this.execute(handlers, req, res);
      if (!result) {
        return res.done(); // direct (void)
      } else if (typeof result === 'string') {
        return res.html(result); // direct (string)
      } else if (!(result as Record<string, unknown>).getContent) {
        return res.success(result); // direct (json)
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
  ): RoutingResult {
    const handler = handlers.shift() as RoutingHandler;
    if (handlers.length === 0) {
      return handler(req, res, () => {
        throw new Error('No more handler.');
      });
    } else {
      const next = (data => {
        if (data) {
          req.data = {...req.data, ...data};
        }
        return this.execute(handlers, req, res);
      }) as RouteNext;
      return handler(req, res, next);
    }
  }
}
