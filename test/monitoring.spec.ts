// tslint:disable: no-any
import { expect } from 'chai';
import { sinon } from '../../../../lamnhan.com/modules/testing/dist/src/index';

import { Monitoring } from '../src/lib/monitoring';

function setup() {
  return new Monitoring();
}

describe('monitoring', () => {

  let logStub: sinon.SinonStub;
  let infoStub: sinon.SinonStub;
  let warnStub: sinon.SinonStub;
  let errorStub: sinon.SinonStub;

  beforeEach(() => {
    logStub = sinon.stub(console, 'log').callsFake((value: any) => ({ log: value }));
    infoStub = sinon.stub(console, 'info').callsFake((value: any) => ({ info: value }));
    warnStub = sinon.stub(console, 'warn').callsFake((value: any) => ({ warn: value }));
    errorStub = sinon.stub(console, 'error').callsFake((value: any) => ({ error: value }));
  });

  afterEach(() => {
    logStub.restore();
    infoStub.restore();
    warnStub.restore();
    errorStub.restore();
  });

  it('#logging', () => {
    const service = setup();
    const r1 = service.logging('xxx', 'debug');
    const r2 = service.logging('xxx', 'info');
    const r3 = service.logging('xxx', 'warning');
    const r4 = service.logging('xxx', 'error');
    expect(r1).eql({ log: 'xxx' });
    expect(r2).eql({ info: 'xxx' });
    expect(r3).eql({ warn: 'xxx' });
    expect(r4).eql({ error: 'xxx' });
  });

  it('#log', () => {
    const service = setup();
    const r = service.log('xxx');
    expect(r).eql({ log: 'xxx' });
  });

  it('#info', () => {
    const service = setup();
    const r = service.info('xxx');
    expect(r).eql({ info: 'xxx' });
  });

  it('#warn', () => {
    const service = setup();
    const r = service.warn('xxx');
    expect(r).eql({ warn: 'xxx' });
  });

  it('#error', () => {
    const service = setup();
    const r = service.error('xxx');
    expect(r).eql({ error: 'xxx' });
  });

});