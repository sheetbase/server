// tslint:disable: no-any ban-ts-ignore
import { expect } from 'chai';
import {
  ServiceStubing,
  rewireFull,
} from '../../../../lamnhan.com/modules/testing/dist/src/index';

import { Main } from '../src/lib/main';

// @lib/server
class MockedServer {}

// @lib/response
class MockedResponse {}

// @lib/router
class MockedRouter {}

// @lib/http
class MockedHttp {}

// @lib/monitoring
class MockedMonitoring {}

// @lib/api-key
class MockedAPIKey {}

// @lib/middleware
class MockedMiddleware {}

// @lib/route
class MockedRoute {
  registerRoutes(...args: any[]) {
    return args;
  }
}

function setup<
  ServiceStubs extends ServiceStubing<Main>,
>(
  serviceStubs?: ServiceStubs,
) {
  return rewireFull(
    '@lib/main',
    {
      '@lib/server': { Server: MockedServer },
      '@lib/response': { Response: MockedResponse },
      '@lib/router': { Router: MockedRouter },
      '@lib/http': { Http: MockedHttp },
      '@lib/monitoring': { Monitoring: MockedMonitoring },
      '@lib/api-key': { APIKey: MockedAPIKey },
      '@lib/middleware': { Middleware: MockedMiddleware },
      '@lib/route': { Route: MockedRoute },
    },
    Main,
    undefined,
    serviceStubs,
  )
  .getResult();
}

describe('main', () => {

  it('instances', async () => {
    const { service } = await setup();
    //@ts-ignore
    expect(service.SERVER instanceof MockedServer).equal(true, '@lib/server');
    //@ts-ignore
    expect(service.RESPONSE instanceof MockedResponse).equal(true, '@lib/response');
    //@ts-ignore
    expect(service.ROUTER instanceof MockedRouter).equal(true, '@lib/router');
    //@ts-ignore
    expect(service.HTTP instanceof MockedHttp).equal(true, '@lib/http');
    //@ts-ignore
    expect(service.MONITORING instanceof MockedMonitoring).equal(true, '@lib/monitoring');
    //@ts-ignore
    expect(service.API_KEY instanceof MockedAPIKey).equal(true, '@lib/api-key');
    //@ts-ignore
    expect(service.MIDDLEWARE instanceof MockedMiddleware).equal(true, '@lib/middleware');
    //@ts-ignore
    expect(service.ROUTE instanceof MockedRoute).equal(true, '@lib/route');
  });

  it('#server', async () => {
    const { service } = await setup();
    const r = service.server();
    expect(r instanceof MockedServer).equal(true);
  });

  it('#router', async () => {
    const { service } = await setup();
    const r = service.router();
    expect(r instanceof MockedRouter).equal(true);
  });

  it('#http', async () => {
    const { service } = await setup();
    const r = service.http();
    expect(r instanceof MockedHttp).equal(true);
  });

  it('#monitoring', async () => {
    const { service } = await setup();
    const r = service.monitoring();
    expect(r instanceof MockedMonitoring).equal(true);
  });

  it('#middleware', async () => {
    const { service } = await setup();
    const r = service.middleware();
    expect(r instanceof MockedMiddleware).equal(true);
  });

  it('#registerRoutes', async () => {
    const { service } = await setup();
    const r: any = service.registerRoutes();
    expect(r[0] instanceof MockedRouter).eql(true);
  });

});
