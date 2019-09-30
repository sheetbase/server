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
  resolveEndpoint: (e: string) => '/' + e,
  isMethodValid: true,
  getRoute: [],
};

// @lib/response
const mockedResponse = {
  done: { done: true },
  html: (html: any) => ({ html }),
  success: (success: any) => ({ success }),
  error: (error: any) => ({ error }),
};

function setup<
  ServiceStubs extends ServiceStubing<Http>,
  ServerMocks extends ServiceMocking<typeof mockedServer>,
  ResponseMocks extends ServiceMocking<typeof mockedResponse>,
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

    expect(r1).equal('/');
    expect(r2).equal('/xxx');
  });

  it('#handler (error)', () => {
    const {
      service,
      serviceTesting,
    } = setup({
      extractQuery: {e: '/'},
      extractBody: { a: 1 },
      getMethod: 'get',
      getEndpoint: '/',
      execute: () => {
        throw new Error('An error'); // throw error
      },
    });

    const httpEvent = {parameter: {e: '/'}};

    const r = service.handler('get', httpEvent);
    const extractQueryArg = serviceTesting.getResult('extractQuery').getArgFirst();
    const extractBodyArg = serviceTesting.getResult('extractBody').getArgFirst();
    const getMethodArgs = serviceTesting.getResult('getMethod').getArgs();
    const getEndpointArg = serviceTesting.getResult('getEndpoint').getArgFirst();
    const executeArgs = serviceTesting.getResult('execute').getArgs();

    expect(r).eql({ error: 'An error' });
    expect(extractQueryArg).eql(httpEvent);
    expect(extractBodyArg).eql(httpEvent);
    expect(getMethodArgs).eql(['get', undefined]);
    expect(getEndpointArg).equal('/');
    expect(executeArgs[0]).eql([]);
    expect(executeArgs[1]).eql({
      query: {e: '/'},
      body: { a: 1 },
      data: {},
    });
    expect(
      !!executeArgs[2].done &&
      !!executeArgs[2].html &&
      !!executeArgs[2].success &&
      !!executeArgs[2].error
    ).equal(true);
  });

  it('#handler (done)', () => {
    const {
      service,
      serviceTesting,
    } = setup({
      extractQuery: {e: '/'},
      extractBody: { a: 1 },
      getMethod: 'post',
      getEndpoint: '/',
      execute: undefined, // empty
    });

    const r = service.handler('post', {});
    const getMethodArgs = serviceTesting.getResult('getMethod').getArgs();

    expect(r).eql({ done: true });
    expect(getMethodArgs).eql(['post', undefined]);
  });

  it('#handler (html)', () => {
    const { service } = setup({
      extractQuery: {e: '/'},
      extractBody: { a: 1 },
      getMethod: 'get',
      getEndpoint: '/',
      execute: 'A html response!', // string
    });

    const r = service.handler('get', {});

    expect(r).eql({ html: 'A html response!' });
  });

  it('#handler (success)', () => {
    const { service } = setup({
      extractQuery: {e: '/'},
      extractBody: { a: 1 },
      getMethod: 'get',
      getEndpoint: '/',
      execute: { a: 1 }, // object
    });

    const r = service.handler('get', {});

    expect(r).eql({ success: { a: 1 } });
  });

  it('#handler (error)', () => {
    const { service } = setup({
      extractQuery: {e: '/'},
      extractBody: { a: 1 },
      getMethod: 'get',
      getEndpoint: '/',
      execute: { a: 1, getContent: true }, // TextOutput or HtmlOutput
    });

    const r = service.handler('get', {});

    expect(r).eql({ a: 1, getContent: true });
  });

  it('#execute (no middleware)', () => {
    const { service } = setup();
    
    const r = service.execute(
      [(...args: any[]) => args],
      { req: true } as any,
      { res: true } as any,
    );
    const req = r[0];
    const res = r[1];
    const next = r[2];

    expect(req).eql({ req: true });
    expect(res).eql({ res: true });
    expect(next.bind({})).throws('No more handler.');
  });

  it('#execute (has middleware, no data)', () => {
    const { service } = setup();
    
    const r = service.execute(
      [
        (req, res, next) => next(),
        (...args: any[]) => args,
      ],
      { data: {} } as any,
      {} as any,
    );
    const req = r[0];

    expect(req).eql({ data: {} });
  });

  it('#execute (has middleware, has data)', () => {
    const { service } = setup();
    
    const r = service.execute(
      [
        (req, res, next) => next({a: 1}),
        (...args: any[]) => args,
      ],
      { data: {} } as any,
      {} as any,
    );
    const req = r[0];

    expect(req).eql({ data: {a: 1} });
  });

});