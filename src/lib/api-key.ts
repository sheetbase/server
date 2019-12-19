import { ServerService } from './server';

export class APIKeyService {

  constructor(private serverService: ServerService) {}

  getApiKeys() {
    const { apiKeys = {}, key } = this.serverService.getOptions();
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