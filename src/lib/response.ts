import { RoutingError, ViewEngine } from './types';
import { Server } from './server';

declare const ejs: {
  render: (templateText: string, data: {}) => string;
};

declare const Handlebars: {
  compile(templateText: string): (data: {}) => string;
};

export class Response {

  private SERVER: Server;

  private allowedExtensions = ['gs', 'hbs', 'ejs'];

  constructor(
    SERVER: Server,
  ) {
    this.SERVER = SERVER;
  }

  send<Data>(data: string | Data) {
    if (typeof data === 'string') {
      return this.html(data);
    } else {
      return this.json(data);
    }
  }

  html(html: string) {
    return HtmlService.createHtmlOutput(html);
  }

  json<Data>(data: Data) {
    const jsonOutput = ContentService.createTextOutput(JSON.stringify(data));
    jsonOutput.setMimeType(ContentService.MimeType.JSON);
    return jsonOutput;
  }

  done() {
    return this.success({ done: true });
  }

  success<Data>(data: Data) {
    return this.json({
      success: true,
      status: 200,
      data: data instanceof Object ? data : { value: data },
    });
  }

  error(input?: string | Error | RoutingError) {
    let theError: RoutingError;
    // default
    if (!input) {
      theError = {
        code: 'unknown',
        message: 'Unknown error.',
      };
    }
    // a code or message
    else if (typeof input === 'string') {
      const { [input]: error } = this.SERVER.getRoutingErrors();
      // a message
      if (!error ) {
        theError = {
          code: 'error',
          message: input,
        };
      }
      // a code with string value
      else if (typeof error === 'string') {
        theError = {
          code: input,
          message: error,
        };
      }
      // a code with full routing error value
      else {
        error.code = input; // set the code
        theError = error;
      }
    }
    // native error
    else if (input instanceof Error) {
      theError = {
        code: input.name,
        message: input.message,
      };
    }
    // a RoutingError
    else {
      theError = input as RoutingError;
    }
    // returns
    return this.json({
      status: 500,
      ... theError,
      error: true,
    });
  }

  render(
    templating: string | GoogleAppsScript.HTML.HtmlTemplate,
    data: {
      // tslint:disable-next-line: no-any
      [key: string]: any;
    } = {},
    viewEngine?: ViewEngine,
  ) {
    // turn file into the templating
    if (typeof templating === 'string') {
      const { views } = this.SERVER.getOptions();
      // extract file name & extension
      const fileName = templating;
      const fileExt = fileName.split('.').pop() as string;
      // set view engine base on the extension if valid 
      if (!viewEngine && this.allowedExtensions.indexOf(fileExt) !== -1) {
        viewEngine = fileExt as ViewEngine;
      }
      // load template from file
      templating = HtmlService.createTemplateFromFile(
        (!!views ? views + '/' : '') + fileName,
      );
    }
    // load template
    const templateText = templating.getRawContent();
    // get html accordingly
    let outputHtml = '';
    // native
    if (viewEngine === 'gs') {
      try {
        for (const key of Object.keys(data)) {
          templating[key] = data[key];
        }
        outputHtml = templating.evaluate().getContent();
      } catch (error) {
        outputHtml = templateText;
      }
    }
    // handlebars
    else if (viewEngine === 'hbs') {
      const render = Handlebars.compile(templateText);
      outputHtml = render(data);
    }
    // ejs
    else if (viewEngine === 'ejs') {
      outputHtml = ejs.render(templateText, data);
    }
    // raw html
    else {
      outputHtml = templateText;
    }
    // returns
    return this.html(outputHtml);
  }

}