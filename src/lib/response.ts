import { ResponseError, ResponseSuccess, RoutingErrors, RoutingError } from './types';
import { OptionService } from './option';

declare const ejs: any;
declare const Handlebars: any;

export class ResponseService {
  private optionService: OptionService;

  private allowedExtensions: string[] = [
    'gs', 'hbs', 'ejs',
  ];

  constructor(optionService: OptionService) {
    this.optionService = optionService;
  }

  setErrors(errors: RoutingErrors, override = false): void {
    this.optionService.setRoutingErrors(errors, override);
  }

  send(content: string | {}) {
    if (content instanceof Object) {
      return this.json(content);
    } else {
      return this.html(content);
    }
  }

  html(html: string) {
    return HtmlService.createHtmlOutput(html);
  }

  render(template: any, data: {} = {}, viewEngine = 'raw') {
    if (typeof template === 'string') {
      const fileName: string = template;
      const views: string = this.optionService.get('views') as string;
      let fileExt: string = (template.split('.') as string[]).pop();
      fileExt = (this.allowedExtensions.indexOf(fileExt) > -1) ? fileExt : null;
      if (fileExt) { viewEngine = fileExt; }
      template = HtmlService.createTemplateFromFile((views ? views + '/' : '') + fileName);
    }
    // render accordingly
    const templateText: string = template.getRawContent();
    let outputHtml: string;
    if (viewEngine === 'native' || viewEngine === 'gs') {
      try {
        for (const key of Object.keys(data)) {
          template[key] = data[key];
        }
        // NOTE: somehow this doesn't work
        outputHtml = template.evaluate().getContent();
      } catch (error) {
        outputHtml = templateText;
      }
    } else if (viewEngine === 'handlebars' || viewEngine === 'hbs') {
      const render = Handlebars.compile(templateText);
      outputHtml = render(data);
    } else if (viewEngine === 'ejs') {
      outputHtml = ejs.render(templateText, data);
    } else {
      outputHtml = templateText;
    }
    return this.html(outputHtml);
  }

  json(object: {}) {
    const JSONString = JSON.stringify(object);
    const JSONOutput = ContentService.createTextOutput(JSONString);
    JSONOutput.setMimeType(ContentService.MimeType.JSON);
    return JSONOutput;
  }

  success(data: any, meta: any = {}) {
    if (!data) {
      return this.error();
    }
    if (!(data instanceof Object)) {
      data = { value: data };
    }
    if (!(meta instanceof Object)) {
      meta = { value: meta };
    }
    return this.json({
      success: true,
      status: 200,
      data,
      meta: {
        timestamp: new Date().getTime(),
        ... meta,
      },
    } as ResponseSuccess);
  }

  error(
    err?: string | ResponseError,
    meta: any = {},
  ) {
    let responseError: ResponseError;
    if (typeof err === 'string') { // a string
      // build response erro from routing errors
      let code: string = err;
      const errors = this.optionService.getRoutingErrors();

      let error = errors[code];
      if (!error) {
        error = { message: code };
        code = null;
      } else {
        error = (typeof error === 'string') ? { status: 400, message: error } : error;
      }

      // return a response error
      const { status = 400, message } = error as RoutingError;
      responseError = { code, message, status };
    } else {  // a ResponseError
      responseError = err as ResponseError || {};
    }

    if (!responseError.status) responseError.status = 500;
    if (!responseError.code) responseError.code = 'app/internal';
    if (!responseError.message) responseError.message = 'Unknown error.';
    if (!(meta instanceof Object)) {
      meta = { value: meta };
    }
    return this.json({
      ... responseError,
      error: true,
      meta: {
        timestamp: new Date().getTime(),
        ... meta,
      },
    } as ResponseError);
  }
}