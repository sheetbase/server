// tslint:disable: no-any ban-ts-ignore
import { expect } from 'chai';

import { Options } from '../src/lib/types';
import { Server } from '../src/lib/server';

function setup(options?: Options) {
  return new Server(options);
}

describe('server', () => {

  it('options', () => {});

  it('props', () => {});

  it('#getOptions', () => {});

  it('#getRoutingErrors', () => {});

  it('#addRoutingError', () => {});

  it('#addRoutingErrors', () => {});

  it('#setRoutingErrors', () => {});

  it('#getDisabledRoutes', () => {});

  it('#addDisabledRoute', () => {});

  it('#addDisabledRoutes', () => {});

  it('#setDisabledRoutes', () => {});

  it('#isRouteDisabled', () => {});

  it('#getMethods', () => {});

  it('#isMethodValid', () => {});

  it('#addSharedMiddlewares', () => {});

  it('#setRouteHandler', () => {});

  it('#setRouteMiddlewares', () => {});

  it('#addRoute', () => {});

  it('#setRouteHandlerAll', () => {});

  it('#setRouteMiddlewaresAll', () => {});

  it('#addRouteAll', () => {});

  it('#getRoute', () => {});

  it('#resolveEndpoint', () => {});

});
