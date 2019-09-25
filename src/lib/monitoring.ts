import { LoggingLevel } from './types';

export class MonitoringService {

  constructor() {}

  logging<Value>(value: Value, level: LoggingLevel = 'DEBUG') {
    if (level === 'ERROR') {
      return this.error(value);
    } else if (level === 'WARNING') {
      return this.warn(value);
    } else if (level === 'INFO') {
      return this.info(value);
    } else {
      return this.log(value);
    }
  }

  log<Value>(value: Value) {
    return console.log(value as any);
  }

  info<Value>(value: Value) {
    return console.info(value as any);
  }

  warn<Value>(value: Value) {
    return console.warn(value as any);
  }

  error<Value>(value: Value) {
    return console.error(value as any);
  }

}
