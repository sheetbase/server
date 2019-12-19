// tslint:disable: no-any ban-ts-ignore
import { expect } from 'chai';
import {
  ServiceStubing,
  ServiceMocking,
  MockBuilder,
  mockService,
  rewireService,
} from '@lamnhan/testing';

import { ResponseService } from '../src/lib/response';

// @lib/server
const mockedServer = {
  getOptions: {},
  getRoutingErrors: {},
};

function setup<
  ServiceStubs extends ServiceStubing<ResponseService>,
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
    ResponseService,
    {
      '@lib/server': mockService({ ...mockedServer, ...serverMocks }),
    },
    serviceStubs,
  );
  const service = serviceRewiring.getInstance();
  return { serviceRewiring, service };
}

// GAS
// @ts-ignore
global['HtmlService'] = {
  createHtmlOutput: (html: string) => html + ' output',
  createTemplateFromFile: (tmplPath: string) => {
    return {
      getRawContent: () => `File '${tmplPath}' content`,
      evaluate: () => ({
        getContent: () => `File '${tmplPath}' content as html rendered by GS`,
      }),
    };
  },
};
// @ts-ignore
global['ContentService'] = {
  MimeType: {
    JSON: 'JSON',
  },
  createTextOutput: (value: any) => {
    return {
      value,
      setMimeType: (mimeType: any) => mimeType,
    };
  },
};

// view engines
// @ts-ignore
global['ejs'] = {
  render: (tmpl: any) => `${tmpl} as html rendered by ejs`,
};
// @ts-ignore
global['Handlebars'] = {
  compile: (tmpl: any) => {
    return () => `${tmpl} as html rendered by handlebars`;
  },
};

function createFakedTemplateFromText(tmpl: string) {
  return {
    getRawContent: () => tmpl,
    evaluate: () => {
      return {
        getContent: () => `${tmpl} as html rendered by GS`,
      };
    },
  } as GoogleAppsScript.HTML.HtmlTemplate;
}


describe('response', () => {

  it('instances', () => {
    const { service } = setup();
    //@ts-ignore
    expect(service.serverService instanceof MockBuilder).equal(true, '@lib/server');
  });
  
  it('props', () => {
    const { service } = setup();
    //@ts-ignore
    expect(service.allowedExtensions).eql([
      'gs', 'hbs', 'ejs'
    ], '.allowedExtensions');
  });

  it('#send', () => {
    const { service } = setup({
      html: (value: any) => value + ' output',
      json: (value: any) => ({ ...value, b: 2 }),
    });

    const r1 = service.html('a html');
    const r2 = service.json({ a: 1 });

    expect(r1).equal('a html output');
    expect(r2).eql({ a: 1, b: 2 });
  });

  it('#html', () => {
    const { service } = setup();
    const r = service.html('a html');
    expect(r).equal('a html output');
  });

  it('#json', () => {
    const { service } = setup();
    const r: any = service.json({ a: 1 });
    expect(r.value).equal('{"a":1}');
  });

  it('#done', () => {
    const { service } = setup({
      success: (data: any) => ({
        success: true,
        status: 200,
        data,
      }),
    });

    const r = service.done();

    expect(r).eql({
      success: true,
      status: 200,
      data: { done: true },
    });
  });

  it('#success', () => {
    const { service } = setup({
      json: (value: any) => value,
    });

    const r1 = service.success({ a: 1 });
    const r2 = service.success('xxx'); // any value

    expect(r1).eql({
      success: true,
      status: 200,
      data: { a: 1 },
    });
    expect(r2).eql({
      success: true,
      status: 200,
      data: { value: 'xxx' },
    });
  });

  it('#error (default)', () => {
    const { service } = setup({
      json: (value: any) => value,
    });

    const r = service.error('');

    expect(r).eql({
      status: 500,
      code: 'unknown',
      message: 'Unknown error.',
      error: true,
    });
  });

  it('#error (a message or a code but no value)', () => {
    const { service } = setup({
      json: (value: any) => value,
    });

    const r1 = service.error('An error');
    const r2 = service.error('app/error');

    expect(r1).eql({
      status: 500,
      code: 'error',
      message: 'An error',
      error: true,
    });
    expect(r2).eql({
      status: 500,
      code: 'error',
      message: 'app/error',
      error: true,
    });
  });

  it('#error (a code with string value)', () => {
    const { service } = setup({
      json: (value: any) => value,
    }, {
      serverMocks: {
        getRoutingErrors: {
          'app/error': 'App error',
        },
      }
    });

    const r = service.error('app/error');

    expect(r).eql({
      status: 500,
      code: 'app/error',
      message: 'App error',
      error: true,
    });
  });

  it('#error (a code with full routing error value)', () => {
    const { service } = setup({
      json: (value: any) => value,
    }, {
      serverMocks: {
        getRoutingErrors: {
          'app/error': {
            status: 501,
            message: 'App error ...',
          },
        },
      }
    });

    const r = service.error('app/error');

    expect(r).eql({
      status: 501,
      code: 'app/error',
      message: 'App error ...',
      error: true,
    });
  });

  it('#error (a native error)', () => {
    const { service } = setup({
      json: (value: any) => value,
    });

    const r = service.error(new Error('The message'));

    expect(r).eql({
      status: 500,
      code: 'Error',
      message: 'The message',
      error: true,
    });
  });

  it('#error (a routing error)', () => {
    const { service } = setup({
      json: (value: any) => value,
    });

    const r = service.error({
      code: 'the/error',
      status: 501,
      message: 'The Error',
    });

    expect(r).eql({
      status: 501,
      code: 'the/error',
      message: 'The Error',
      error: true,
    });
  });
  
  it('#render (from templating)', () => {
    const { service } = setup({
      html: (value: any) => value,
    });

    const tmpl = createFakedTemplateFromText('a template text');
    const r1 = service.render(tmpl); // no engine, keep as is
    const r2 = service.render(tmpl, {}, 'gs'); // default engine
    const r3 = service.render(tmpl, {}, 'ejs'); // ejs
    const r4 = service.render(tmpl, {}, 'hbs'); // handlebars

    expect(r1).equal('a template text');
    expect(r2).equal('a template text as html rendered by GS');
    expect(r3).equal('a template text as html rendered by ejs');
    expect(r4).equal('a template text as html rendered by handlebars');
  });

  it('#render (from file)', () => {
    const { service } = setup({
      html: (value: any) => value,
    });

    const r1 = service.render('index');
    const r2 = service.render('index.gs');
    const r3 = service.render('index.ejs');
    const r4 = service.render('index.hbs');
    const r5 = service.render('index.html', {}, 'hbs'); // override file ext

    expect(r1).equal('File \'index\' content');
    expect(r2).equal('File \'index.gs\' content as html rendered by GS');
    expect(r3).equal('File \'index.ejs\' content as html rendered by ejs');
    expect(r4).equal('File \'index.hbs\' content as html rendered by handlebars');
    expect(r5).equal('File \'index.html\' content as html rendered by handlebars');
  });

  it('#render (from file, custom views folder)', () => {
    const { service } = setup(
      {
        html: (value: any) => value,
      },
      {
        serverMocks: {
          getOptions: { views: 'views' },
        }
      },
    );

    const r = service.render('index');

    expect(r).equal('File \'views/index\' content');
  });

});
