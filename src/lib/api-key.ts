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
      apiKeys[key] = { title: 'Default' };
    }
    return apiKeys;
  }

  getApiKey(key: string) {
    const apiKeys = this.getApiKeys();
    const apiKey = apiKeys[key];
    if (!!apiKey) { apiKey.value = key; }
    return apiKey;
  }

}