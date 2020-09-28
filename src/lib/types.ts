import {ResponseService} from './services/response.service';

export interface Options {
  /**
   * The view template folder
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
  value?: string; // only exists when get a single api key
  title?: string;
  description?: string;
  createdAt?: string;
  [meta: string]: any;
}

export interface ApiKeys {
  [key: string]: ApiKey;
}

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

export interface RouterExtending {
  baseEndpoint?: string;
  disabledRoutes?: DisabledRoutes;
  routingErrors?: RoutingErrors;
}

export interface RouteGroup extends RouterExtending {
  [method: string]: any;
}

export interface RouteSet {
  endpoint: string;
  disabled?: DisabledRouteValue;
  errors?: RoutingErrors;
  all?(req: RouteRequest, res: RouteResponse): any;
  get?(req: RouteRequest, res: RouteResponse): any;
  post?(req: RouteRequest, res: RouteResponse): any;
  put?(req: RouteRequest, res: RouteResponse): any;
  patch?(req: RouteRequest, res: RouteResponse): any;
  delete?(req: RouteRequest, res: RouteResponse): any;
}

export interface RouteRequest {
  query: any;
  body: any;
  data: any;
}

export type RouteResponse = ResponseService;

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
  next: RouteNext
) => any;

export interface RoutingError {
  message: string;
  status?: number;
  code?: string | number;
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

export type ViewEngine = 'gs' | 'hbs' | 'ejs';
