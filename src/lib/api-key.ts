import { ApiKeys } from './types';
import { Server } from './server';

export class APIKey {

  private SERVER: Server;

  constructor(SERVER: Server) {
    this.SERVER = SERVER;
  }

  load() {
    const { apiKeys, key } = this.SERVER.getOptions();
    const result: ApiKeys = !!apiKeys ? apiKeys : {};
    if (!!key) {
      result['default'] = { title: 'Untitled', key };
    }
    return result;
  }

}