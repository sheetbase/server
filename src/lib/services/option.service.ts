import {Options, Extendable} from '../types/server.type';

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

  setOptions(options: Options | Extendable) {
    return (this.options = {...this.options, ...options});
  }
}
