import { expect } from 'chai';
import { rewireModule } from '@lamnhan/testing';

class MockedMain {}

async function getEntry() {
  const moduleRewiring = rewireModule(
    () => import('../src/lib/index'),
    {
      '@lib/main': { Main: MockedMain }
    },
  );
  const m = await moduleRewiring.getModule();
  return m.server();
}

describe('index', () => {

  it('#server', async () => {
    const SERVER = await getEntry();
    expect(SERVER instanceof MockedMain).equal(true);
  });

});
