import {Options} from '../types/server.type';

export class OptionService {
  private options: Options;

  constructor(options: Options) {
    this.options = {
      views: '',
      ...options,
    };
  }

  getOptions() {
    return this.options;
  }
}
