// tslint:disable: no-any
import { expect } from 'chai';
import {
  rewireService,
} from '../../../../lamnhan.com/modules/testing/dist/src/index';

import { Monitoring } from '../src/lib/monitoring';

global['console'].log = ((value: any) => ({ log: value })) as any;
global['console'].info = ((value: any) => ({ info: value })) as any;
global['console'].warn = ((value: any) => ({ warn: value })) as any;
global['console'].error = ((value: any) => ({ error: value })) as any;

function setup() {
  return rewireService(Monitoring).getInstance();
}

describe('monitoring', () => {

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