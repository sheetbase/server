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
  addRoutingErrors: undefined,
  addDisabledRoutes: undefined,
  setRouteMiddlewaresAll: undefined,
  addSharedMiddlewares: undefined,
  addRouteAll: undefined,
  addRoute: undefined,
  resolveEndpoint: undefined,
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
  return rewireService(
    Router,
    {
      '@lib/server': mockService({ ...mockedServer, ...serverMocks }),
    },
    serviceStubs,
  )
  .getResult();
}

describe('router', () => {

  it('instances', () => {
    const { service } = setup();
    //@ts-ignore
    expect(service.SERVER instanceof MockBuilder).equal(true, '@lib/server');
  });

  it('props', () => {
    const { service } = setup();
    // @ts-ignore
    expect(service.baseEndpoint).equal('');
  });

  it('#extend', () => {
    const { service } = setup();
    const r = service.extend();
    expect(r instanceof Router).equal(true);
  });

  it('#config (no values)', () => {
    const {
      service,
      serviceTesting,
    } = setup({
      setEndpoint: undefined,
      setErrors: undefined,
      setDisabled: undefined,
    });

    const r = service.config({});
    const setEndpointCalled = serviceTesting.getResult('setEndpoint').hasBeenCalled();
    const setErrorsCalled = serviceTesting.getResult('setErrors').hasBeenCalled();
    const setDisabledCalled = serviceTesting.getResult('setDisabled').hasBeenCalled();

    expect(setEndpointCalled).equal(false, 'setEndpoint');
    expect(setErrorsCalled).equal(false, 'setErrors');
    expect(setDisabledCalled).equal(false, 'setDisabled');
    expect(r instanceof Router).equal(true);
  });

  it('#config (has values)', () => {
    const {
      service,
      serviceTesting,
    } = setup({
      setEndpoint: undefined,
      setErrors: undefined,
      setDisabled: undefined,
    });

    const r = service.config({
      baseEndpoint: 'xxx',
      routingErrors: {error: 'Error'},
      disabledRoutes: {a: ['get']},
    });
    const setEndpointArg = serviceTesting.getResult('setEndpoint').getArgFirst();
    const setErrorsArg = serviceTesting.getResult('setErrors').getArgFirst();
    const setDisabledArg = serviceTesting.getResult('setDisabled').getArgFirst();
  
    expect(setEndpointArg).equal('xxx');
    expect(setErrorsArg).eql({error: 'Error'});
    expect(setDisabledArg).eql({a: ['get']});
    expect(r instanceof Router).equal(true);
  });

  it('#setEndpoint', () => {
    const { service } = setup();

    const r = service.setEndpoint('xxx');

    //@ts-ignore
    expect(r.baseEndpoint).equal('xxx');
    expect(r instanceof Router).equal(true);
  });

  it('#setErrors', () => {
    const {
      mockedServices: {
        '@lib/server': serverTesting,
      },
      service,
    } = setup();

    const r = service.setErrors({error: 'Error'});
    const addRoutingErrorsArg = serverTesting.getResult('addRoutingErrors').getArgFirst();

    expect(addRoutingErrorsArg).eql({error: 'Error'});
    expect(r instanceof Router).equal(true);
  });

  it('#setDisabled', () => {
    const {
      mockedServices: {
        '@lib/server': serverTesting,
      },
      service,
    } = setup();

    const r = service.setDisabled({a: ['get']});
    const addDisabledRoutesArg = serverTesting.getResult('addDisabledRoutes').getArgFirst();

    expect(addDisabledRoutesArg).eql({a: ['get']});
    expect(r instanceof Router).equal(true);
  });

  it('#buildEndpoint', () => {
    const {
      mockedServices: {
        '@lib/server': serverTesting,
      },
      service,
    } = setup();

    const r = service.buildEndpoint('xxx');
    const resolveEndpointArgs = serverTesting.getResult('resolveEndpoint').getArgs();

    expect(resolveEndpointArgs).eql(['', 'xxx']);
  });

  it('#use (for route)', () => {
    const {
      mockedServices: {
        '@lib/server': serverTesting,
      },
      service,
    } = setup({
      buildEndpoint: '.',
    });

    const r = service.use('/xxx', (req, res, next) => next());
    const setRouteMiddlewaresAllArgs = serverTesting.getResult('setRouteMiddlewaresAll').getArgs();

    expect(setRouteMiddlewaresAllArgs[0]).equal('/xxx'); // result of resolveEndpoint
    expect(setRouteMiddlewaresAllArgs[1][0] instanceof Function).equal(true); // handler
  });

  it('#use (for all)', () => {
    const {
      mockedServices: {
        '@lib/server': serverTesting,
      },
      service,
    } = setup();

    const r = service.use(
      (req, res, next) => next(),
      (req, res, next) => next(),
    );
    const addSharedMiddlewaresArg = serverTesting.getResult('addSharedMiddlewares').getArg();

    expect(addSharedMiddlewaresArg[0] instanceof Function).equal(true, 'middleware 1');
    expect(addSharedMiddlewaresArg[1] instanceof Function).equal(true, 'middleware 2');
  });

  it('#all', () => {
    const {
      mockedServices: {
        '@lib/server': serverTesting,
      },
      service,
    } = setup({
      buildEndpoint: '.',
    });

    const r = service.all('/xxx', (req, res, next) => next());
    const addRouteAllArgs = serverTesting.getResult('addRouteAll').getArgs();

    expect(addRouteAllArgs[0]).equal('/xxx'); // result of resolveEndpoint
    expect(addRouteAllArgs[1][0] instanceof Function).equal(true); // handler
  });

  it('#get', () => {
    const {
      mockedServices: {
        '@lib/server': serverTesting,
      },
      service,
    } = setup({
      buildEndpoint: '.',
    });

    const r = service.get('/xxx', (req, res, next) => next());
    const addRouteArgs = serverTesting.getResult('addRoute').getArgs();

    expect(addRouteArgs[0]).equal('get'); // method
    expect(addRouteArgs[1]).equal('/xxx'); // result of resolveEndpoint
    expect(addRouteArgs[2][0] instanceof Function).equal(true); // handler
  });

  it('#post', () => {
    const {
      mockedServices: {
        '@lib/server': serverTesting,
      },
      service,
    } = setup({
      buildEndpoint: '.',
    });

    const r = service.post('/xxx', (req, res, next) => next());
    const addRouteArgs = serverTesting.getResult('addRoute').getArgs();

    expect(addRouteArgs[0]).equal('post'); // method
    expect(addRouteArgs[1]).equal('/xxx'); // result of resolveEndpoint
    expect(addRouteArgs[2][0] instanceof Function).equal(true); // handler
  });

  it('#put', () => {
    const {
      mockedServices: {
        '@lib/server': serverTesting,
      },
      service,
    } = setup({
      buildEndpoint: '.',
    });

    const r = service.put('/xxx', (req, res, next) => next());
    const addRouteArgs = serverTesting.getResult('addRoute').getArgs();

    expect(addRouteArgs[0]).equal('put'); // method
    expect(addRouteArgs[1]).equal('/xxx'); // result of resolveEndpoint
    expect(addRouteArgs[2][0] instanceof Function).equal(true); // handler
  });

  it('#patch', () => {
    const {
      mockedServices: {
        '@lib/server': serverTesting,
      },
      service,
    } = setup({
      buildEndpoint: '.',
    });

    const r = service.patch('/xxx', (req, res, next) => next());
    const addRouteArgs = serverTesting.getResult('addRoute').getArgs();

    expect(addRouteArgs[0]).equal('patch'); // method
    expect(addRouteArgs[1]).equal('/xxx'); // result of resolveEndpoint
    expect(addRouteArgs[2][0] instanceof Function).equal(true); // handler
  });

  it('#delete', () => {
    const {
      mockedServices: {
        '@lib/server': serverTesting,
      },
      service,
    } = setup({
      buildEndpoint: '.',
    });

    const r = service.delete('/xxx', (req, res, next) => next());
    const addRouteArgs = serverTesting.getResult('addRoute').getArgs();

    expect(addRouteArgs[0]).equal('delete'); // method
    expect(addRouteArgs[1]).equal('/xxx'); // result of resolveEndpoint
    expect(addRouteArgs[2][0] instanceof Function).equal(true); // handler
  });

});
