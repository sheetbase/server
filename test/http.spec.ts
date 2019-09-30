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
  resolveEndpoint: '.',
  isMethodValid: true,
};

// @lib/response
const mockedResponse = {};

function setup<
  ServiceStubs extends ServiceStubing<Http>,
  ServerMocks extends ServiceMocking<typeof mockedServer>,
  ResponseMocks extends ServiceMocking<typeof mockedServer>,
>(
  serviceStubs?: ServiceStubs,
  serviceMocks: {
    serverMocks?: ServerMocks;
    responseMocks?: ResponseMocks;
  } = {},
) {
  const {
    serverMocks = {},
    responseMocks = {},
  } = serviceMocks;
  return rewireService(
    Http,
    {
      '@lib/server': mockService({ ...mockedServer, ...serverMocks }),
      '@lib/response': mockService({ ...mockedResponse, ...responseMocks }),
    },
    serviceStubs,
  )
  .getResult();
}

describe('http', () => {

  it('instances', () => {
    const { service } = setup();
    //@ts-ignore
    expect(service.SERVER instanceof MockBuilder).equal(true, '@lib/server');
    //@ts-ignore
    expect(service.RESPONSE instanceof MockBuilder).equal(true, '@lib/response');
  });

  it('#get', () => {
    const { service } = setup({
      handler: '...',
    });

    const r = service.get({ parameter: { e: '/' } });

    expect(r).eql([
      'get', { parameter: { e: '/' } }
    ]);
  });

  it('#post', () => {});

  it('#extractQuery', () => {
    const { service } = setup();

    const r1 = service.extractQuery({});
    const r2 = service.extractQuery({ parameter: {a: 1, b: 2} });

    expect(r1).eql({});
    expect(r2).eql({a: 1, b: 2});
  });

  it('#extractBody (no body data in query)', () => {
    const { service } = setup();

    const r1 = service.extractBody({});
    const r2 = service.extractBody({ postData: {} });
    const r3 = service.extractBody({ postData: { contents: '{"a":1,"b":2}' } });

    expect(r1).eql({});
    expect(r2).eql({});
    expect(r3).eql({a: 1, b: 2});
  });

  it('#extractBody (body in query)', () => {
    const { service } = setup();
    const r = service.extractBody({
      parameter: { body: '{"a":2,"c":3}' },
      postData: { contents: '{"a":1,"b":2}' },
    });
    expect(r).eql({a: 1, b: 2, c: 3});
  });
  
  it('#getMethod', () => {
    const { service } = setup();

    const r1 = service.getMethod('get');
    const r2 = service.getMethod('post');
    const r3 = service.getMethod('post', 'put'); // override http method
    const r4 = service.getMethod('post', 'patch'); // override http method
    const r5 = service.getMethod('post', 'delete'); // override http method

    expect(r1).equal('get');
    expect(r2).equal('post');
    expect(r3).equal('put');
    expect(r4).equal('patch');
    expect(r5).equal('delete');
  });

  it('#getMethod', () => {
    const { service } = setup(undefined, {
      serverMocks: {
        isMethodValid: false,
      },
    });
    const r = service.getMethod('get', 'xxx' as any); // not a valid method
    expect(r).equal('get');
  });

  it('#getEndpoint', () => {
    const { service } = setup();

    const r1 = service.getEndpoint();
    const r2 = service.getEndpoint('xxx');

    expect(r1).equal('');
    expect(r2).equal('xxx');
  });

  it('#handler', () => {});

  it('#execute', () => {});

});