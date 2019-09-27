// tslint:disable: no-any ban-ts-ignore
import { expect } from 'chai';
import {
  ServiceStubing,
  ServiceMocking,
  MockBuilder,
  mockService,
  rewireService,
} from '../../../../lamnhan.com/modules/testing/dist/src/index';

import { Router } from '../src/lib/router';

// @lib/server
const mockedServer = {
  getOptions: {},
};

function setup<
  ServiceStubs extends ServiceStubing<Router>,
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
    Router,
    {
      '@lib/server': mockService({ ...mockedServer, ...serverMocks }),
    },
    serviceStubs,
  );
  const service = serviceRewiring.getInstance();
  return { serviceRewiring, service };
}

describe('router', () => {

  it('instances', () => {
    const { service } = setup();
    //@ts-ignore
    expect(service.SERVER instanceof MockBuilder).equal(true, '@lib/server');
  });

  it('props', () => {});

  it('#extend', () => {});

  it('#config', () => {});

  it('#setEndpoint', () => {});

  it('#setErrors', () => {});

  it('#setDisabled', () => {});

  it('#use', () => {});

  it('#all', () => {});

  it('#get', () => {});

  it('#post', () => {});

  it('#put', () => {});

  it('#patch', () => {});

  it('#delete', () => {});

});
