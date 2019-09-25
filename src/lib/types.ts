import { ResponseService } from './response';
import { RouterService } from './router';

export interface Options {
  allowMethodsWhenDoGet?: boolean;
  views?: string;
  disabledRoutes?: string[];
  routingErrors?: RoutingErrors;
}

export interface AddonRoutesOptions {
  router: RouterService;
  disabledRoutes?: string[];
  endpoint?: string;
  middlewares?: RouteHandler[];
}

export interface HttpEvent {
  parameter?: any;
  postData?: any;
}

export interface RouteRequest {
  query?: RouteQuery;
  params?: RouteQuery;
  body?: any;
  data?: any;
}

export interface RouteResponse extends ResponseService { }

export interface RouteQuery {
  e?: string;
  method?: string;
  body?: string;
  [key: string]: any;
}

export interface ResponseError {
  error?: boolean;
  code?: string;
  message?: string;
  status?: number;
  meta?: {
    timestamp?: number;
    [prop: string]: any;
  };
}

export interface ResponseSuccess {
  data: any;
  success?: boolean;
  status?: number;
  meta?: {
    timestamp?: number;
    [prop: string]: any;
  };
}

export type RouteNext = (data?: any) => RouteHandler;

export type RouteHandler = (
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

export type LoggingLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR';
