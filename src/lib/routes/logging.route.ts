import {LoggingLevel, LoggingValue} from '../types/server.type';
import {MonitoringService} from '../services/monitoring.service';

export class LoggingRoute {
  endpoint = '/logging';

  disabled = ['put'];

  constructor(private monitoringService: MonitoringService) {}

  /**
   * Set a server log
   * @param body.level - The logging level
   * @param body.value - The logging value
   */
  put(req: {
    body: {
      level: LoggingLevel;
      value: LoggingValue;
    };
  }) {
    const {level, value} = req.body;
    return this.monitoringService.logging(value, level);
  }
}
