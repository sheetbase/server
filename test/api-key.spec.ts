// tslint:disable: no-any ban-ts-ignore
import { expect } from 'chai';
import {
  ServiceStubing,
  ServiceMocking,
  MockBuilder,
  mockService,
  rewireService,
} from '../../../../lamnhan.com/modules/testing/dist/src/index';

import { APIKey } from '../src/lib/api-key';

// @lib/server
const mockedServer = {
  getOptions: {},
};

function setup<
  ServiceStubs extends ServiceStubing<APIKey>,
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
    APIKey,
    {
      '@lib/server': mockService({ ...mockedServer, ...serverMocks }),
    },
    serviceStubs,
  ).getInstance();
}

describe('api-key', () => {

  it('instances', () => {
    const service = setup();
    //@ts-ignore
    expect(service.SERVER instanceof MockBuilder).equal(true, '@lib/server');
  });

  it('#getApiKeys (no api keys, no key)', () => {
    const service = setup();
    const r = service.getApiKeys();
    expect(r).eql({});
  });

  it('#getApiKeys (no api keys, has key)', () => {
    const service = setup(undefined, {
      serverMocks: {
        getOptions: { key: 'xxx' },
      }
    });
    const r = service.getApiKeys();
    expect(r).eql({
      xxx: { title: 'Default' }
    });
  });

  it('#getApiKeys (has api keys, has key)', () => {
    const service = setup(undefined, {
      serverMocks: {
        getOptions: {
          key: 'xxx',
          apiKeys: {
            xxx2: { title: '2' },
            xxx3: { title: '3' },
          }
        },
      }
    });
    const r = service.getApiKeys();
    expect(r).eql({
      xxx: { title: 'Default' },
      xxx2: { title: '2' },
      xxx3: { title: '3' },
    });
  });

  it('#getApiKey (not exists)', () => {
    const service = setup();
    const r = service.getApiKey('xxx');
    expect(r).equal(undefined);
  });

  it('#getApiKey (exists)', () => {
    const service = setup(undefined, {
      serverMocks: {
        getOptions: { key: 'xxx' },
      }
    });
    const r = service.getApiKey('xxx');
    expect(r).eql({title: 'Default', key: 'xxx' });
  });

});