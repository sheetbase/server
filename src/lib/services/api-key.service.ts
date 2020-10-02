import {OptionService} from './option.service';

export class APIKeyService {
  constructor(private optionService: OptionService) {}

  getApiKeys() {
    const {apiKeys = {}, key} = this.optionService.getOptions();
    if (key) {
      apiKeys[key] = {title: 'Default'};
    }
    return apiKeys;
  }

  getApiKey(key: string) {
    const apiKeys = this.getApiKeys();
    const apiKey = apiKeys[key];
    if (apiKey) {
      apiKey.value = key;
    }
    return apiKey;
  }
}
