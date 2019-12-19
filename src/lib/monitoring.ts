import { LoggingLevel, LoggingValue } from './types';

export class MonitoringService {

  constructor() {}

  logging(value: LoggingValue, level: LoggingLevel = 'debug') {
    if (level === 'error') {
      return this.error(value);
    } else if (level === 'warning') {
      return this.warn(value);
    } else if (level === 'info') {
      return this.info(value);
    } else {
      return this.log(value);
    }
  }

  log(value: LoggingValue) {
    return console.log(value);
  }

  info(value: LoggingValue) {
    return console.info(value);
  }

  warn(value: LoggingValue) {
    return console.warn(value);
  }

  error(value: LoggingValue) {
    return console.error(value);
  }

}
