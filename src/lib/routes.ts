import { RouteHandler, AddonRoutesOptions } from './types';

import { MonitoringService } from './monitoring';

export const ROUTING_ERRORS  = {};

export function registerRoutes(
  Monitoring: MonitoringService,
) {
  return (options?: AddonRoutesOptions) => {

    const {
      router,
      endpoint: loggingEndpoint = 'logging',
      disabledRoutes = [],
      middlewares = [(req, res, next) => next()] as RouteHandler[],
    } = options;

    // register errors & disabled routes
    router.setDisabled(disabledRoutes);
    router.setErrors(ROUTING_ERRORS);

    // system info
    router.get('/system', ...middlewares, (req, res) => {
      return res.success({ sheetbase: true });
    });

    // logging
    router.put('/' + loggingEndpoint, ...middlewares, (req, res) => {
      const { level, value } = req.body;
      try {
        Monitoring.logging(value, level);
      } catch (error) {
        return res.error(error);
      }
      return res.success({ done: true });
    });

  };
}
