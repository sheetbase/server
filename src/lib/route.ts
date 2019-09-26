import {
  DisabledRoutes,
  RoutingErrors,
  LoggingLevel,
  LoggingValue,
} from './types';

import { Monitoring } from './monitoring';
import { Router } from './router';

export class Route {

  private MONITORING: Monitoring;
  private ROUTER: Router;

  baseEndpoint = '';
  disabledRoutes: DisabledRoutes = {};
  routingErrors: RoutingErrors = {};

  constructor(
    ROUTER: Router,
    MONITORING: Monitoring,
  ) {
    this.ROUTER = ROUTER;
    this.MONITORING = MONITORING;
  }

  registerRoutes() {

    const router = this.ROUTER.extend().config(this);

    // system info
    router.get('/system', (req, res) => res.success(this.GET__system()));

    // logging
    router.put('/logging', (req, res) => {
      try {
        this.PUT__logging(req.body);
      } catch (error) {
        return res.error(error);
      }
      return res.done();
    });

  }

  GET__system() {
    return { sheetbase: true };
  }

  PUT__logging(
    body: {
      level: LoggingLevel,
      value: LoggingValue,
    }
  ) {
    const { level, value } = body;
    return this.MONITORING.logging(value, level);
  }
  
}
