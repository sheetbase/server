import { HttpEvent } from './types';

export class RequestService {

  constructor() { }

  query(e: HttpEvent = {}) {
    return this.params(e);
  }

  params(e: HttpEvent = {}) {
    return (e.parameter ? e.parameter : {});
  }

  body(e: HttpEvent = {}) {
    let body = {};
    try {
      body = JSON.parse((e.postData && e.postData.contents) ? e.postData.contents : '{}');
    } catch (error) {
      /* */
    }
    return body;
  }
}