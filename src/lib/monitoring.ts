// tslint:disable: no-any
import { LoggingLevel } from './types';

export class Monitoring {

  constructor() {}

  logging<Value>(value: Value, level: LoggingLevel = 'debug') {
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
