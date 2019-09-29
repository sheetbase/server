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
  addRoutingErrors: '.',
  addDisabledRoutes: '.'
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
    const { serviceRewiring, service } = setup({
      setEndpoint: undefined,
      setErrors: undefined,
      setDisabled: undefined,
    });

    const r = service.config({});

    const serviceTesting = serviceRewiring.getStubbedInstance();
    const setEndpointCalled = serviceTesting.getResult('setEndpoint').hasBeenCalled();
    const setErrorsCalled = serviceTesting.getResult('setErrors').hasBeenCalled();
    const setDisabledCalled = serviceTesting.getResult('setDisabled').hasBeenCalled();

    expect(setEndpointCalled).equal(false, 'setEndpoint');
    expect(setErrorsCalled).equal(false, 'setErrors');
    expect(setDisabledCalled).equal(false, 'setDisabled');
    expect(r instanceof Router).equal(true);
  });

  it('#config (has values)', () => {
    const { serviceRewiring, service } = setup({
      setEndpoint: undefined,
      setErrors: undefined,
      setDisabled: undefined,
    });

    const r = service.config({
      baseEndpoint: 'xxx',
      routingErrors: {error: 'Error'},
      disabledRoutes: {a: ['get']},
    });

    const serviceTesting = serviceRewiring.getStubbedInstance();
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
    const { serviceRewiring, service } = setup();

    const r = service.setErrors({error: 'Error'});

    const { '@lib/server': serverTesting } = serviceRewiring.getMockedServices();
    const addRoutingErrorsArg = serverTesting.getResult('addRoutingErrors').getArgFirst();

    expect(addRoutingErrorsArg).eql({error: 'Error'});
    expect(r instanceof Router).equal(true);
  });

  it('#setDisabled', () => {
    const { serviceRewiring, service } = setup();

    const r = service.setDisabled({a: ['get']});

    const { '@lib/server': serverTesting } = serviceRewiring.getMockedServices();
    const addDisabledRoutesArg = serverTesting.getResult('addDisabledRoutes').getArgFirst();

    expect(addDisabledRoutesArg).eql({a: ['get']});
    expect(r instanceof Router).equal(true);
  });

  it('#use', () => {});

  it('#all', () => {});

  it('#get', () => {});

  it('#post', () => {});

  it('#put', () => {});

  it('#patch', () => {});

  it('#delete', () => {});

});
