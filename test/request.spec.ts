import { expect } from 'chai';

import { Request } from '../src/lib/request';

function setup() {
  return new Request();
}

describe('request', () => {

  it('#query', () => {
    const service = setup();

    const r1 = service.query({});
    const r2 = service.query({ parameter: {a: 1, b: 2} });
    expect(r1).eql({});
    expect(r2).eql({a: 1, b: 2});
  });

  it('#body', () => {
    const service = setup();

    const r1 = service.body({});
    const r2 = service.body({ postData: {} });
    const r3 = service.body({ postData: { contents: '{"a":1,"b":2}' } });
    expect(r1).eql({});
    expect(r2).eql({});
    expect(r3).eql({a: 1, b: 2});
  });

});
