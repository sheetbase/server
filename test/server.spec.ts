// tslint:disable: no-any ban-ts-ignore
import { expect } from 'chai';
import {
  ServiceStubing,
  rewireService,
} from '../../../../lamnhan.com/modules/testing/dist/src/index';

import { Server } from '../src/lib/server';

function setup<
  ServiceStubs extends ServiceStubing<Server>,
>(
  serviceStubs?: ServiceStubs,
) {
  return rewireService(
    Server,
    undefined,
    serviceStubs,
  )
  .getResult();
}

describe('server', () => {

  it('options (default)', () => {
    const service = new Server();
    // @ts-ignore
    expect(service.options).eql({ views: '' });
  });

  it('options (custom)', () => {
    const service = new Server({
      views: 'views',
      key: 'xxx',
      apiKeys: {
        a: { title: 'A' },
        b: { title: 'B' },
      },
      trigger: true as any,
      failure: true as any,
    });
    // @ts-ignore
    expect(service.options).eql({
      views: 'views',
      key: 'xxx',
      apiKeys: {
        a: { title: 'A' },
        b: { title: 'B' },
      },
      trigger: true as any,
      failure: true as any,
    });
  });

  it('props', () => {
    const service = new Server();
    // @ts-ignore
    expect(service.routingErrors).eql({});
    // @ts-ignore
    expect(service.disabledRoutes).eql({});
    // @ts-ignore
    expect(service.routes).eql({});
    // @ts-ignore
    expect(service.routeMiddlewares).eql({});
    // @ts-ignore
    expect(service.sharedMiddlewares).eql([]);
    // @ts-ignore
    expect(service.methods).eql([
      'get', 'post', 'put', 'patch', 'delete',
    ]);
  });

  it('#getOptions', () => {
    const { service } = setup();
    const r = service.getOptions();
    expect(r).eql({ views: '' });
  });

  it('#getMethods', () => {
    const { service } = setup();
    const r = service.getMethods();
    expect(r).eql([
      'get', 'post', 'put', 'patch', 'delete',
    ]);
  });

  it('#getRoutingErrors', () => {
    const { service } = setup();
    const r = service.getRoutingErrors();
    expect(r).eql({});
  });
  
  it('#getDisabledRoutes', () => {
    const { service } = setup();
    const r = service.getDisabledRoutes();
    expect(r).eql({});
  });

  it('#resolveEndpoint', () => {
    const { service } = setup();

    const r1 = service.resolveEndpoint();
    const r2 = service.resolveEndpoint('/');
    const r3 = service.resolveEndpoint('/xxx');
    const r4 = service.resolveEndpoint('xxx', 'abc');

    expect(r1).equal('/');
    expect(r2).equal('/');
    expect(r3).equal('/xxx');
    expect(r4).equal('/xxx/abc');
  });

  it('#isMethodValid', () => {
    const { service } = setup();

    const r1 = service.isMethodValid('get');
    const r2 = service.isMethodValid('post');
    const r3 = service.isMethodValid('put');
    const r4 = service.isMethodValid('patch');
    const r5 = service.isMethodValid('delete');
    const r6 = service.isMethodValid('xxx');

    expect(r1).equal(true, 'get');
    expect(r2).equal(true, 'post');
    expect(r3).equal(true, 'put');
    expect(r4).equal(true, 'patch');
    expect(r5).equal(true, 'delete');
    expect(r6).equal(false, 'xxx');
  });

  it('#isRouteDisabled', () => {
    const { service } = setup();
    // @ts-ignore
    service.disabledRoutes = {
      'xxx1': '*',
      'xxx2': ['get'],
    };

    const r1 = service.isRouteDisabled('get', 'xxx1');
    const r2 = service.isRouteDisabled('get', 'xxx2');
    const r3 = service.isRouteDisabled('post', 'xxx2');
    const r4 = service.isRouteDisabled('get', 'xxx3');

    expect(r1).equal(true, 'all');
    expect(r2).equal(true, 'valid');
    expect(r3).equal(false, 'not valid');
    expect(r4).equal(false, 'not exists');
  });

  it('#addRoutingError', () => {
    const { service } = setup();

    service.addRoutingError('a', 'A');
    service.addRoutingError('b', { message: 'B' });

    // @ts-ignore
    expect(service.routingErrors).eql({
      a: 'A',
      b: { message: 'B' },
    });
  });

  it('#addRoutingErrors', () => {
    const { service } = setup();

    service.addRoutingErrors({
      a: 'A',
      b: { message: 'B' },
    });

    // @ts-ignore
    expect(service.routingErrors).eql({
      a: 'A',
      b: { message: 'B' },
    });
  });

  it('#setRoutingErrors', () => {
    const { service } = setup();
    // @ts-ignore
    service.routingErrors = {
      a: 'A',
      b: { message: 'B' },
    };

    service.setRoutingErrors({a: 'A'});

    // @ts-ignore
    expect(service.routingErrors).eql({a: 'A'});
  });

  it('#addDisabledRoute', () => {
    const { service } = setup();

    service.addDisabledRoute('a', '*');
    service.addDisabledRoute('b', ['get']);

    // @ts-ignore
    expect(service.disabledRoutes).eql({
      a: '*',
      b: ['get'],
    });
  });

  it('#addDisabledRoutes', () => {
    const { service } = setup();

    service.addDisabledRoutes({
      a: '*',
      b: ['get'], 
    });

    // @ts-ignore
    expect(service.disabledRoutes).eql({
      a: '*',
      b: ['get'],
    });
  });

  it('#setDisabledRoutes', () => {
    const { service } = setup();
    // @ts-ignore
    service.disabledRoutes = {
      a: '*',
      b: ['get'], 
    };

    service.setDisabledRoutes({a: '*'});

    // @ts-ignore
    expect(service.disabledRoutes).eql({a: '*'});
  });

  it('#getRoute (not exists)', () => {
    const { service, serviceTesting } = setup({
      isRouteDisabled: false,
    });

    const r = service.getRoute('get', '/');
    const handler = r[0];
    const isRouteDisabledArgs = serviceTesting.getResult('isRouteDisabled').getArgs();
    const renderResult = handler(
      {} as any,
      { render: (value: any) => value } as any,
      {} as any,
    );
    const htmlResult = handler(
      {} as any,
      {
        render: () => { throw new Error() },
        html: (value: any) => value,
      } as any,
      {} as any,
    );
    
    expect(isRouteDisabledArgs).eql(['get', '/']);
    expect(renderResult).equal('errors/404');
    expect(htmlResult).equal('<h1>404!</h1><p>Not found.</p>');
  });

  it('#getRoute (disabled)', () => {
    const { service } = setup({
      isRouteDisabled: true,
    });

    const r = service.getRoute('get', '/');
    const handler = r[0];
    const renderResult = handler(
      {} as any,
      { render: (value: any) => value } as any,
      {} as any,
    );

    expect(renderResult).equal('errors/404');
  });

  it('#getRoute (exists)', () => {
    const { service } = setup({
      isRouteDisabled: false,
    });
    // @ts-ignore
    service.routes = { 'get:/': () => true };

    const r = service.getRoute('get', '/');
    const handler = r[0];
    const handlerResult = handler({} as any, {} as any, {} as any);

    expect(handlerResult).equal(true);
  });

  it('#getRoute (exists, with middlewares)', () => {
    const { service } = setup({
      isRouteDisabled: false,
    });
    // @ts-ignore
    service.sharedMiddlewares = [ () => 'm1' ];
    // @ts-ignore
    service.routeMiddlewares = { 'get:/': [() => 'm2'] };
    // @ts-ignore
    service.routes = { 'get:/': () => 'handler' };

    const r = service.getRoute('get', '/');
    const m1 = r[0];
    const m2 = r[1];
    const handler = r[2];
    const m1Result = m1({} as any, {} as any, {} as any);
    const m2Result = m2({} as any, {} as any, {} as any);
    const handlerResult = handler({} as any, {} as any, {} as any);

    expect(m1Result).equal('m1');
    expect(m2Result).equal('m2');
    expect(handlerResult).equal('handler');
  });

  it('#addSharedMiddlewares', () => {
    const { service } = setup();
    // @ts-ignore
    service.sharedMiddlewares = [() => 'm1'];

    service.addSharedMiddlewares([() => 'm2']);
    // @ts-ignore
    const m1: any = service.sharedMiddlewares[0];
    // @ts-ignore
    const m2: any = service.sharedMiddlewares[1];
    const m1Result = m1();
    const m2Result = m2();

    expect(m1Result).equal('m1');
    expect(m2Result).equal('m2');
  });

  it('#setRouteMiddlewares', () => {});

  it('#setRouteMiddlewaresAll', () => {});

  it('#setRouteHandler', () => {});

  it('#setRouteHandlerAll', () => {});

  it('#addRoute', () => {});

  it('#addRouteAll', () => {});

});
