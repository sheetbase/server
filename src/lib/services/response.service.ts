/* eslint-disable no-undef */
import {RoutingError, ViewEngine} from '../types';
import {ServerService} from './server.service';

declare const ejs: {
  render: (templateText: string, data: {}) => string;
};

declare const Handlebars: {
  compile(templateText: string): (data: {}) => string;
};

export class ResponseService {
  private allowedExtensions = ['gs', 'hbs', 'ejs'];

  constructor(private serverService: ServerService) {}

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
    return this.success({done: true});
  }

  success<Data>(data: Data) {
    return this.json({
      success: true,
      status: 200,
      data: data instanceof Object ? data : {value: data},
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
      const {[input]: error} = this.serverService.getRoutingErrors();
      // a message
      if (!error) {
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
      ...theError,
      error: true,
    });
  }

  oops(code: '403' | '404' | '500' | '501') {
    const msgs = {
      403: 'Unauthorized.',
      404: 'Not found.',
      500: 'Server error.',
      501: 'Not supported.',
    };
    try {
      return this.render(`errors/${code}`);
    } catch (error) {
      return this.html(`<h1>${code}!</h1><p>${msgs[code]}</p>`);
    }
  }

  render(
    templating: string | GoogleAppsScript.HTML.HtmlTemplate,
    data: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [key: string]: any;
    } = {},
    viewEngine?: ViewEngine
  ) {
    // turn file into the templating
    if (typeof templating === 'string') {
      const {views} = this.serverService.getOptions();
      // extract file name & extension
      const fileName = templating;
      const fileExt = fileName.split('.').pop() as string;
      // set view engine base on the extension if valid
      if (!viewEngine && this.allowedExtensions.indexOf(fileExt) !== -1) {
        viewEngine = fileExt as ViewEngine;
      }
      // load template from file
      templating = HtmlService.createTemplateFromFile(
        (views ? views + '/' : '') + fileName
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
