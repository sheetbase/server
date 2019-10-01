import {
  DisabledRoutes,
  RoutingErrors,
  LoggingLevel,
  LoggingValue,
} from './types';

import { Main } from './main';
import { Router } from './router';

export class Route {

  private MAIN: Main;

  baseEndpoint = '';
  disabledRoutes: DisabledRoutes = {};
  routingErrors: RoutingErrors = {};

  constructor(MAIN: Main) {
    this.MAIN = MAIN;
  }

  registerRoutes(ROUTER: Router) {
    const router = ROUTER.extend().config(this);
    router.get('/system', () => this.GET__system());
    router.put('/logging', (req) => this.PUT__logging(req.body));
  }

  /**
   * Get the system infomation
   */
  GET__system() {
    return { sheetbase: true };
  }

  /**
   * Set a server log
   * @param body.level - The logging level
   * @param body.value - The logging value
   */
  PUT__logging(
    body: {
      level: LoggingLevel,
      value: LoggingValue,
    }
  ) {
    const { level, value } = body;
    return this.MAIN.monitoring().logging(value, level);
  }

}
