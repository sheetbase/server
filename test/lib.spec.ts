/* eslint-disable @typescript-eslint/no-explicit-any */
import {describe, it} from 'mocha';
import {expect} from 'chai';
import {ServiceStubing, rewireFull} from '@lamnhan/testea';

import {Lib} from '../src/lib/index';

// @lib/server
class MockedServerService {}

// @lib/response
class MockedResponseService {}

// @lib/router
class MockedRouterService {}

// @lib/http
class MockedHttpService {}

// @lib/monitoring
class MockedMonitoringService {}

// @lib/api-key
class MockedAPIKeyService {}

// @lib/middleware
class MockedMiddlewareService {}

function setup<ServiceStubs extends ServiceStubing<Lib>>(
  serviceStubs?: ServiceStubs
) {
  return rewireFull(
    '@lib/main',
    {
      '@lib/server': {ServerService: MockedServerService},
      '@lib/response': {ResponseService: MockedResponseService},
      '@lib/router': {RouterService: MockedRouterService},
      '@lib/http': {HttpService: MockedHttpService},
      '@lib/monitoring': {MonitoringService: MockedMonitoringService},
      '@lib/api-key': {APIKeyService: MockedAPIKeyService},
      '@lib/middleware': {MiddlewareService: MockedMiddlewareService},
    },
    Lib,
    undefined,
    serviceStubs
  ).getResult();
}

describe('main', () => {
  it('instances', async () => {
    const {service} = await setup();
    expect(service.serverService instanceof MockedServerService).equal(
      true,
      '@lib/server'
    );
    expect(service.responseService instanceof MockedResponseService).equal(
      true,
      '@lib/response'
    );
    expect(service.routerService instanceof MockedRouterService).equal(
      true,
      '@lib/router'
    );
    expect(service.httpService instanceof MockedHttpService).equal(
      true,
      '@lib/http'
    );
    expect(service.monitoringService instanceof MockedMonitoringService).equal(
      true,
      '@lib/monitoring'
    );
    expect(service.apiKeyService instanceof MockedAPIKeyService).equal(
      true,
      '@lib/api-key'
    );
    expect(service.middlewareService instanceof MockedMiddlewareService).equal(
      true,
      '@lib/middleware'
    );
  });

  it('#registerRoutes', async () => {
    const {service} = await setup();
    const r: any = service.registerRoutes();
    expect(r).equal(true);
  });
});
