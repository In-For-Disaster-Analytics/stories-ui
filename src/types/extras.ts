import { StringIndexedObject } from './types';

/** Raw extras type */
export interface RawExtra {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

/** Processes a raw extras field into a dictionary
 * @param {RawExtra[]} [extras]
 * @returns {StringIndexedObject}
 */
export default function parseExtras(extras?: RawExtra[]): StringIndexedObject {
  const obj: StringIndexedObject = {};
  if (!extras) return obj;
  for (const extra of extras) {
    obj[extra.key] = extra.value;
  }
  return obj;
}
