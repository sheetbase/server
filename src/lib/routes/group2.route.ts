import {RouteResponse, DisabledRoutes, RoutingErrors} from '../types';

export class Group2Route {
  baseEndpoint = 'group2';

  disabledRoutes: DisabledRoutes = {
    '/group2/e1': '*',
    '/e2': ['post'],
  };

  routingErrors: RoutingErrors = {
    'e2/e1': 'Error 1',
  };

  constructor() {}

  /**
   * Endpoint 1
   */
  GET__e1() {
    return {a: 1};
  }

  /**
   * Endpoint 2
   * @params body.param1 - The param 1
   * @params body.param2 - The param 2
   */
  POST__e2(
    req: {
      body: {
        param1: string;
        param2?: boolean;
      };
    },
    res: RouteResponse
  ) {
    return true;
  }
}
