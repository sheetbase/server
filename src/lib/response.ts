import { ResponseError } from './types';
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

  error(input: string | Error | ResponseError) {
    let responseError: ResponseError;
    // a code or any string
    if (typeof input === 'string') {
      const routingErrors = this.SERVER.getRoutingErrors();
      // build response error from routing errors
      const error = routingErrors[input];
      // no config data or just text
      if (!error || typeof error === 'string') {
        responseError = { message: error || input };
      } else {
        responseError = error;
      }
    }
    // native error
    else if (input instanceof Error) {
      responseError = { message: input.message };
    }
    // a ResponseError
    else {
      responseError = input;
    }
    // returns
    return this.json({
      // default data
      status: 500,
      code: 'unknown',
      message: 'Unknown error.',
      // custom
      ... responseError,
      // must have
      error: true,
    });
  }

  render(
    templating: string | GoogleAppsScript.HTML.HtmlTemplate,
    data: {
      // tslint:disable-next-line: no-any
      [key: string]: any;
    } = {},
    viewEngine = 'raw',
  ) {
    // turn file into templating
    if (typeof templating === 'string') {
      const { views } = this.SERVER.getOptions();
      // extract file name & extension
      const fileName = templating;
      const fileExt = templating.split('.').pop() as string;
      // set view engine base on the extension if valid 
      viewEngine = this.allowedExtensions.indexOf(fileExt) !== -1 ? fileExt : 'raw';
      // load template from file
      templating = HtmlService.createTemplateFromFile(
        (views ? views + '/' : '') + fileName,
      );
    }
    // load template
    const templateText = templating.getRawContent();
    // get html accordingly
    let outputHtml = '';
    // native
    if (
      viewEngine === 'native' ||
      viewEngine === 'gs'
    ) {
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
    else if (
      viewEngine === 'handlebars' ||
      viewEngine === 'hbs'
    ) {
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