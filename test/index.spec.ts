import { expect } from 'chai';
import { rewireModule } from '../../../../lamnhan.com/modules/testing/dist/src/index';

class MockedMain {}

async function getServer() {
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
    const SERVER = await getServer();
    expect(SERVER instanceof MockedMain).equal(true);
  });

});
