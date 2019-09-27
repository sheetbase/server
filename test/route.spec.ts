// tslint:disable: no-any ban-ts-ignore
import { expect } from 'chai';
import {
  ServiceStubing,
  ServiceMocking,
  MockBuilder,
  mockService,
  rewireService,
} from '../../../../lamnhan.com/modules/testing/dist/src/index';

import { Route } from '../src/lib/route';

// @lib/monitoring
const mockedMonitoring = {};

function setup<
  ServiceStubs extends ServiceStubing<Route>,
  MonitoringMocks extends ServiceMocking<typeof mockedMonitoring>,
>(
  serviceStubs?: ServiceStubs,
  serviceMocks: {
    monitoringMocks?: MonitoringMocks;
  } = {},
) {
  const {
    monitoringMocks = {},
  } = serviceMocks;
  const serviceRewiring = rewireService(
    Route,
    {
      '@lib/monitoring': mockService({ ...mockedMonitoring, ...monitoringMocks }),
    },
    serviceStubs,
  )
  const service = serviceRewiring.getInstance();
  return { serviceRewiring, service };
}

describe('route', () => {

  it('instances', () => {
    const { service } = setup();
    //@ts-ignore
    expect(service.MONITORING instanceof MockBuilder).equal(true, '@lib/monitoring');
  });

  it('props', () => {});

  it('#registerRoutes', () => {});

  it('#GET__system', () => {});

  it('#PUT__logging', () => {});

});
