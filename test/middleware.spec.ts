// tslint:disable: no-any ban-ts-ignore
import { expect } from 'chai';
import {
  ServiceStubing,
  ServiceMocking,
  MockBuilder,
  mockService,
  rewireService,
} from '@lamnhan/testing';

import { MiddlewareService } from '../src/lib/middleware';

// @lib/server
const mockedServer = {
  getOptions: {},
};

// @lib/api-key
const mockedAPIKey = {
  getApiKey: undefined,
};

function setup<
  ServiceStubs extends ServiceStubing<MiddlewareService>,
  ServerMocks extends ServiceMocking<typeof mockedServer>,
  APIKeyMocks extends ServiceMocking<typeof mockedAPIKey>,
>(
  serviceStubs?: ServiceStubs,
  serviceMocks: {
    serverMocks?: ServerMocks;
    apiKeyMocks?: APIKeyMocks;
  } = {},
) {
  const {
    serverMocks = {},
    apiKeyMocks = {},
  } = serviceMocks;
  const serviceRewiring = rewireService(
    MiddlewareService,
    {
      '@lib/server': mockService({ ...mockedServer, ...serverMocks }),
      '@lib/api-key': mockService({ ...mockedAPIKey, ...apiKeyMocks }),
    },
    serviceStubs,
  );
  const service = serviceRewiring.getInstance();
  return { serviceRewiring, service };
}

describe('api-key', () => {

  it('instances', () => {
    const { service } = setup();
    // @ts-ignore
    expect(service.serverService instanceof MockBuilder).equal(true, '@lib/server');
    // @ts-ignore
    expect(service.apiKeyService instanceof MockBuilder).equal(true, '@lib/api-key');
  });
  
  it('failed (#render)', () => {
    const { serviceRewiring, service } = setup();
    const apiKeyMiddleware = service.apiKey();

    // not support api key (also no key in query or body)
    const r1 = apiKeyMiddleware(
      { query: {}, body: {} } as any,
      { render: (...args: any[]) => args } as any,
      () => true as any,
    );
    // not support api key (key in query)
    const r2 = apiKeyMiddleware(
      { query: { key: 'xxx' }, body: {} } as any,
      { render: (...args: any[]) => args } as any,
      () => true as any,
    );
    // not support api key (key in body)
    const r3 = apiKeyMiddleware(
      { query: {}, body: { key: 'xxx2' } } as any,
      { render: (...args: any[]) => args } as any,
      () => true as any,
    );

    const {
      '@lib/api-key': apiKeyTesting,
    } = serviceRewiring.getMockedServices();
    const getApiKeyStackedArgs = apiKeyTesting
      .getResult('getApiKey').getStackedArgs();

    expect(getApiKeyStackedArgs).eql([[undefined], ['xxx'], ['xxx2']]);
    expect(r1).eql(['errors/403']);
    expect(r2).eql(['errors/403']);
    expect(r3).eql(['errors/403']);
  });  

  it('failed (#html)', () => {
    const { service } = setup();
    const apiKeyMiddleware = service.apiKey();

    const r = apiKeyMiddleware(
      { query: {}, body: {} } as any,
      {
        render: () => { throw new Error() },
        html: (...args: any[]) => args,
      } as any,
      () => true as any,
    );

    expect(r).eql(['<h1>403!</h1><p>Unauthorized.</p>']);
  });

  it('failed (#failure)', () => {
    let failureArgs: any[] = [];
    const { service } = setup(undefined, {
      serverMocks: {
        getOptions: {
          failure: (...args: any[]) => {
            failureArgs = args;
            return 'a custom failure handler';
          },
        },
      },
    });
    const apiKeyMiddleware = service.apiKey();

    const r = apiKeyMiddleware(
      { query: {}, body: {} } as any,
      { render: () => { throw new Error() } } as any,
      () => true as any,
    );

    expect(failureArgs[0]).eql({ query: {}, body: {} }); // req
    expect(Object.keys(failureArgs[1])).eql(['render']); // res
    expect(r).equal('a custom failure handler');
  });

  it('ok (no #trigger)', () => {
    const { service } = setup(undefined, {
      apiKeyMocks: {
        getApiKey: { key: 'xxx' },
      }
    });
    const apiKeyMiddleware = service.apiKey();

    const r = apiKeyMiddleware(
      { query: {}, body: {} } as any,
      {} as any,
      () => 'next()' as any,
    );

    expect(r).equal('next()');
  });

  it('ok (has #trigger)', () => {
    let triggerArgs: any[] = [];
    const { service } = setup(undefined, {
      serverMocks: {
        getOptions: {
          trigger: (...args: any[]) => triggerArgs = args,
        },
      },
      apiKeyMocks: {
        getApiKey: { title: 'Default', key: 'xxx' },
      },
    });
    const apiKeyMiddleware = service.apiKey();

    const r = apiKeyMiddleware(
      { query: {}, body: {} } as any,
      {} as any,
      () => 'next()' as any,
    );

    expect(triggerArgs).eql([
      { query: {}, body: {} }, // req
      { title: 'Default', key: 'xxx' }, // the api key
    ]);
    expect(r).equal('next()');
  });

});
