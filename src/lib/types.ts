// tslint:disable: no-any
import { Response } from './response';

export interface Options {
  /**
   * The template folder
   */
  views?: string;
  /**
   * Single api key
   */
  key?: string;
  /**
   * Multiple api keys
   */
  apiKeys?: ApiKeys;
  /**
   * Handler for invalid api key
   */
  failure?: (req: RouteRequest, res: RouteResponse) => void;
  /**
   * Trigger every time an api key is used
   */
  trigger?: (req: RouteRequest, apiKey: ApiKey) => void;
}

export interface ApiKey {
  key: string;
  title?: string;
  description?: string;
  createdAt?: string;
  [meta: string]: any;
}

export interface ApiKeys {
  [name: string]: ApiKey;
};

export type HttpMethod = 'get' | 'post';

export interface HttpParam {
  e?: string;
  method?: RoutingMethod;
  body?: string;
  [param: string]: any;
}

export interface HttpEvent {
  parameter?: HttpParam;
  postData?: {
    contents?: string;
  };
}

export interface RouteInstance {
  baseEndpoint?: string;
  disabledRoutes?: DisabledRoutes;
  routingErrors?: RoutingErrors;
}

export interface RouteRequest {
  query: any;
  body: any;
  data: any;
}

export interface RouteResponse extends Response {}

export type RouteNext = (data?: {}) => RoutingHandler;

export interface ResponseSuccess {
  data: {};
  success?: boolean;
  status?: number;
}

export interface ResponseError extends RoutingError {
  error?: boolean;
}

export type RoutingMethod = HttpMethod | 'put' | 'patch' | 'delete';

export type RoutingHandler = (
  req: RouteRequest,
  res: RouteResponse,
  next?: RouteNext,
) => any;

export interface RoutingError {
  message: string;
  code?: string | number;
  status?: number;
}

export interface RoutingErrors {
  [code: string]: string | RoutingError;
}

export type DisabledRouteValue = '*' | RoutingMethod[];

export interface DisabledRoutes {
  [endpoint: string]: DisabledRouteValue;
}

export type Middlewares = RoutingHandler[];

export interface Routes {
  [id: string]: RoutingHandler;
}

export interface RouteMiddlewares {
  [id: string]: Middlewares;
}

export type LoggingLevel = 'debug' | 'info' | 'warning' | 'error';

export type LoggingValue = string | {};
