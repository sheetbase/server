export class SystemRoute {
  endpoint = '/system';

  constructor() {}

  /**
   * Get the system infomation
   */
  get() {
    return {sheetbase: true};
  }
}
