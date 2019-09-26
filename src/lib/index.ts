import { Options } from './types';
import { Main } from './main';

export function server(options?: Options) {
  return new Main(options);
}
