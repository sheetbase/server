import {DisabledRoutes, RoutingErrors} from '../types';

export class Group1Route {
  disabledRoutes: DisabledRoutes = {
    '/e0': ['get'],
  };

  routingErrors: RoutingErrors = {
    'e0/e1': 'Error 1',
  };

  constructor() {}

  /**
   * Endpoint 0
   */
  GET__e0() {
    return 0;
  }
}
