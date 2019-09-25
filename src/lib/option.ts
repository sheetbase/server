import { Options, RoutingErrors } from './types';

export class OptionService {
  private options: Options;

  constructor(options: Options = {}) {
    this.options = {
      allowMethodsWhenDoGet: false,
      views: '',
      disabledRoutes: [],
      routingErrors: {},
      ...options,
    };
  }

  get(key: string = null): Options | any {
    if (key) {
      return this.options[key];
    }
    return this.options;
  }

  set(dataOrKey: Options | string, value: any = null): Options {
    if (dataOrKey instanceof Object) {
      const data = dataOrKey;
      this.options = { ... this.options, ...data as Options };
    } else {
      const key: string = dataOrKey;
      this.options[key] = value;
    }
    return this.options;
  }

  getAllowMethodsWhenDoGet(): boolean {
    return this.options.allowMethodsWhenDoGet;
  }
  setAllowMethodsWhenDoGet(value: boolean): void {
    this.options.allowMethodsWhenDoGet = value;
  }

  getViews(): string {
    return this.options.views;
  }
  setViews(value: string): void {
    this.options.views = value;
  }

  getDisabledRoutes(): string | string[] {
    return this.options.disabledRoutes;
  }
  setDisabledRoutes(value: string[], override = false): void {
    if (override) {
      this.options.disabledRoutes = value;
    } else {
      this.options.disabledRoutes = [
        ... this.options.disabledRoutes as string[],
        ...value,
      ];
    }
  }

  getRoutingErrors(): RoutingErrors {
    return this.options.routingErrors;
  }
  setRoutingErrors(value: RoutingErrors, override = false): void {
    if (override) {
      this.options.routingErrors = value;
    } else {
      this.options.routingErrors = { ... this.options.routingErrors, ...value };
    }
  }
}