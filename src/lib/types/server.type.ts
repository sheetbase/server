import {ResponseService} from '../services/response.service';

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
  [meta: string]: unknown;
}

export interface ApiKeys {
  [key: string]: ApiKey;
}

export type HttpMethod = 'get' | 'post';

export interface HttpParam {
  e?: string;
  method?: RoutingMethod;
  body?: string;
  [param: string]: unknown;
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
  middlewares?: RoutingHandler[];
}

export interface RouteGroup extends RouterExtending {
  [method: string]: unknown;
}

export interface RouteSet {
  endpoint: string;
  disabled?: DisabledRouteValue;
  errors?: RoutingErrors;
  middlewares?: RoutingHandler[];
  all?(req: RouteRequest, res: RouteResponse): RoutingResult;
  get?(req: RouteRequest, res: RouteResponse): RoutingResult;
  post?(req: RouteRequest, res: RouteResponse): RoutingResult;
  put?(req: RouteRequest, res: RouteResponse): RoutingResult;
  patch?(req: RouteRequest, res: RouteResponse): RoutingResult;
  delete?(req: RouteRequest, res: RouteResponse): RoutingResult;
}

export interface RouteRequest {
  query: Record<string, unknown>;
  body: Record<string, unknown>;
  data: Record<string, unknown>;
}

export type RouteResponse = ResponseService;

export type RouteNext = (data?: Record<string, unknown>) => RoutingHandler;

export interface ResponseSuccess {
  data: Record<string, unknown>;
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
) => RoutingResult;

export type RoutingResult =
  | void
  | string
  | unknown[]
  | Record<string, unknown>
  | GoogleAppsScript.Content.TextOutput
  | GoogleAppsScript.HTML.HtmlOutput;

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

export type LoggingValue = string | Record<string, unknown>;

export type ViewEngine = 'gs' | 'hbs' | 'ejs';
