// tslint:disable: no-any ban-ts-ignore
import { expect } from 'chai';
import {
  ServiceStubing,
  ServiceMocking,
  MockBuilder,
  mockService,
  rewireService,
} from '../../../../lamnhan.com/modules/testing/dist/src/index';

import { Http } from '../src/lib/http';

// @lib/server
const mockedServer = {
  getOptions: {},
};

// @lib/request
const mockedRequest = {};

// @lib/response
const mockedResponse = {};

function setup<
  ServiceStubs extends ServiceStubing<Http>,
  ServerMocks extends ServiceMocking<typeof mockedServer>,
  RequestMocks extends ServiceMocking<typeof mockedServer>,
  ResponseMocks extends ServiceMocking<typeof mockedServer>,
>(
  serviceStubs?: ServiceStubs,
  serviceMocks: {
    serverMocks?: ServerMocks;
    requestMocks?: RequestMocks;
    responseMocks?: ResponseMocks;
  } = {},
) {
  const {
    serverMocks = {},
    requestMocks = {},
    responseMocks = {},
  } = serviceMocks;
  const serviceRewiring = rewireService(
    Http,
    {
      '@lib/server': mockService({ ...mockedServer, ...serverMocks }),
      '@lib/request': mockService({ ...mockedRequest, ...requestMocks }),
      '@lib/response': mockService({ ...mockedResponse, ...responseMocks }),
    },
    serviceStubs,
  );
  const service = serviceRewiring.getInstance();
  return { serviceRewiring, service };
}

describe('http', () => {

  it('instances', () => {
    const { service } = setup();
    //@ts-ignore
    expect(service.SERVER instanceof MockBuilder).equal(true, '@lib/server');
    //@ts-ignore
    expect(service.REQUEST instanceof MockBuilder).equal(true, '@lib/request');
    //@ts-ignore
    expect(service.RESPONSE instanceof MockBuilder).equal(true, '@lib/response');
  });

  it('#get', () => {});

  it('#post', () => {});

  it('#extractQuery', () => {});

  it('#extractBody', () => {});

  it('#extractEndpoint', () => {});

  it('#extractMethod', () => {});

  it('#handler', () => {});

  it('#execute', () => {});

});