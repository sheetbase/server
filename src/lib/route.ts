import {
  LoggingLevel,
  LoggingValue,
} from './types';
import { RouterService } from './router';
import { MonitoringService } from './monitoring';

export class RouteService {

  baseEndpoint = '';

  constructor(
    private routerService: RouterService,
    private monitoringService: MonitoringService
  ) {}

  registerRoutes() {
    const router = this.routerService
      .extend()
      .config(this);
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
   * @params body.level - The logging level
   * @params body.value - The logging value
   */
  PUT__logging(
    body: {
      level: LoggingLevel;
      value: LoggingValue;
    }
  ) {
    const { level, value } = body;
    return this.monitoringService.logging(value, level);
  }

}
