import { HttpEvent } from './types';

export class Request {

  constructor() {}

  query(e: HttpEvent = {}) {
    return e.parameter || {};
  }

  body(e: HttpEvent = {}) {
    return (e.postData && e.postData.contents) ? JSON.parse(e.postData.contents) : {};
  }

}