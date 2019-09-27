import { Server } from './server';

export class APIKey {

  private SERVER: Server;

  constructor(
    SERVER: Server,
  ) {
    this.SERVER = SERVER;
  }

  getApiKeys() {
    const { apiKeys = {}, key } = this.SERVER.getOptions();
    if (!!key) {
      apiKeys['default'] = { title: 'Untitled', key };
    }
    return apiKeys;
  }

  getApiKey(key: string) {
    const apiKeys = this.getApiKeys();
    return apiKeys[key];
  }

}