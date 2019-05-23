import { chmodSync, constants, exists, unlinkSync } from 'fs';
import { readFile, writeFile } from 'jsonfile';

import { homedir } from 'os';
import { join } from 'path';

/**
 * Read, Write, or Exist Dotfiles
 * @param  {__dirname} dirname The relative dirname
 * @param  {string} name The dotfile name
 * @return {object} exists, read, or write Promises
 */
export default (dirname: string, name: string) => {
  if (!name || !dirname) {
    throw new Error('Both name and dirname parameters are required');
  }

  if (dirname[0] === '~') {
    dirname = homedir();
  }
  const filename = `.${name}`;
  const fullpath = join(dirname, filename);

  return {
    exists: () => new Promise<boolean>((resolve, reject) => {
      exists(fullpath, resolve);
    }),
    read: () => new Promise<any>((resolve, reject) => { // tslint:disable-line: no-any
      readFile(fullpath, (err, obj) => {
        if (err) return reject(err);
        resolve(obj);
      });
    }),
    write: <T>(obj: T) => new Promise<T>((resolve, reject) => {
      writeFile(fullpath, obj, (err) => {
        if (err) return reject(err);
        // if a platform is not Windows(include x64)
        if ('win32' !== process.platform) {
          // same as chmod 600
          chmodSync(fullpath, constants.S_IRUSR | constants.S_IWUSR);
        }
        resolve(obj);
      });
    }),
    delete: () => new Promise<void>((resolve, reject) => {
      unlinkSync(fullpath);
      resolve();
    }),
  };
};
