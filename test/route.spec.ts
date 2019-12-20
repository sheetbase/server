// tslint:disable: no-any ban-ts-ignore
import { expect } from 'chai';
import {
  ServiceStubing,
  ServiceMocking,
  MockBuilder,
  mockService,
  rewireService,
} from '@lamnhan/testing';

import { RouteService } from '../src/lib/route';

// @lib/router
const mockedRouter = {
  routeInstance: null,
  routes: {} as any,
  extend() {
    return mockedRouter;
  },
  config(t: any) {
    mockedRouter.routeInstance = t;
    return mockedRouter;
  },
  get(e: any, h: any) {
    mockedRouter.routes['get:' + e] = h;
  },
  put(e: any, h: any) {
    mockedRouter.routes['put:' + e] = h;
  }
};

// @lib/monitoring
const mockedMonitoring = {
  logging: '...',
};

function setup<
  ServiceStubs extends ServiceStubing<RouteService>,
  RouterMocks extends ServiceMocking<typeof mockedRouter>,
  MonitoringMocks extends ServiceMocking<typeof mockedMonitoring>,
>(
  serviceStubs?: ServiceStubs,
  serviceMocks: {
    routerMocks?: RouterMocks;
    monotoringMocks?: MonitoringMocks;
  } = {},
) {
  const {
    routerMocks = {},
    monotoringMocks = {},
  } = serviceMocks;
  return rewireService(
    RouteService,
    {
      '@lib/router': mockService({ ...mockedRouter, ...routerMocks }),
      '@lib/monitoring': mockService({ ...mockedMonitoring, ...monotoringMocks }),
    },
    serviceStubs,
  )
  .getResult();
}

describe('route', () => {

  it('instances', () => {
    const { service } = setup();
    //@ts-ignore
    expect(service.monitoringService instanceof MockBuilder).equal(true, '@lib/main');
  });

  it('props', () => {
    const { service } = setup();
    expect(service.baseEndpoint).equal('');
  });

  it('#registerRoutes', () => {
    const { service } = setup({
      GET__system: () => ({ GET__system: null }),
      PUT__logging: (...args: any[]) => ({ PUT__logging: args }),
    });

    const router: any = service.registerRoutes();
    const r1 = router.routes['get:/system']();
    const r2 = router.routes['put:/logging']({ body: {a: 1} });

    expect(router.routeInstance instanceof RouteService).equal(true);
    expect(r1).eql({ GET__system: null });
    expect(r2).eql({ PUT__logging: [
      {a: 1}, // body
    ]});
  });

  it('#GET__system', () => {
    const { service } = setup();
    const r = service.GET__system();
    expect(r).eql({ sheetbase: true });
  });

  it('#PUT__logging', () => {
    const { service } = setup();
    const r = service.PUT__logging({
      level: 'debug',
      value: 'xxx',
    });
    expect(r).eql([ 'xxx', 'debug' ]);
  });

});
