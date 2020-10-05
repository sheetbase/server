export class ServerRoute {
  endpoint = '/system';

  errors = {
    'server/no-app-name': 'No unique "appName" provided',
  };

  constructor() {}

  /**
   * Get the system infomation
   */
  get() {
    return {sheetbase: true};
  }
}
