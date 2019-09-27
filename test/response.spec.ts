// tslint:disable: no-any ban-ts-ignore
import { expect } from 'chai';
import {
  ServiceStubing,
  ServiceMocking,
  MockBuilder,
  mockService,
  rewireService,
} from '../../../../lamnhan.com/modules/testing/dist/src/index';

import { Response } from '../src/lib/response';

// @lib/server
const mockedServer = {
  getOptions: {},
};

function setup<
  ServiceStubs extends ServiceStubing<Response>,
  ServerMocks extends ServiceMocking<typeof mockedServer>,
>(
  serviceStubs?: ServiceStubs,
  serviceMocks: {
    serverMocks?: ServerMocks;
  } = {},
) {
  const {
    serverMocks = {},
  } = serviceMocks;
  const serviceRewiring = rewireService(
    Response,
    {
      '@lib/server': mockService({ ...mockedServer, ...serverMocks }),
    },
    serviceStubs,
  );
  const service = serviceRewiring.getInstance();
  return { serviceRewiring, service };
}

describe('response', () => {

  it('instances', () => {
    const { service } = setup();
    //@ts-ignore
    expect(service.SERVER instanceof MockBuilder).equal(true, '@lib/server');
  });

  it('props', () => {});

  it('#send', () => {});

  it('#html', () => {});

  it('#json', () => {});

  it('#done', () => {});

  it('#success', () => {});

  it('#error', () => {});

  it('#render', () => {});

});
