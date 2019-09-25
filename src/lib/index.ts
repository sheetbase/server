import { Options } from './types';

import { OptionService } from './option';
import { HttpService } from './http';
import { RequestService } from './request';
import { ResponseService } from './response';
import { RouterService } from './router';
import { MonitoringService } from './monitoring';
import { registerRoutes } from './routes';

export function sheetbase(options?: Options) {
  const Option = new OptionService(options);
  const Router = new RouterService(Option);
  const Request = new RequestService();
  const Response = new ResponseService(Option);
  const HTTP = new HttpService(Option, Response, Router);
  const Monitoring = new MonitoringService();
  return {
    Option,
    Router,
    Request,
    Response,
    HTTP,
    Monitoring,
    registerRoutes: registerRoutes(Monitoring),
  };
}
