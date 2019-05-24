import { chmodSync, constants, exists, existsSync, unlinkSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { readFile, writeFile } from 'jsonfile';

export interface Dotfile {
  exists: () => Promise<boolean>;
  read: () => Promise<any>; // tslint:disable-line: no-any
  write: <T>(obj: T) => Promise<T>;
  delete: () => Promise<void>;
}

/**
 * Read, Write, or Exist Dotfiles
 * @param  {__dirname} dirname The relative dirname
 * @param  {string} name The dotfile name
 * @return {Dotfile} `delete`, `exists`, `read` and `write` Promises
 */
export default (dirname: string, name: string): Dotfile => {
  if (!name || !dirname) {
    throw new Error('Both name and dirname parameters are required');
  }

  if (dirname[0] === '~') {
    dirname = homedir();
  }
  const filename = `.${name}`;
  const fullpath = join(dirname, filename);

  return {
    exists: () => new Promise<boolean>((resolve) => resolve(existsSync(fullpath))),
    read: () => new Promise<any>( // tslint:disable-line: no-any
      (resolve, reject) => readFile(fullpath, (err, obj) => err ? reject(err) : resolve(obj)),
    ),
    write: <T>(obj: T) => new Promise<T>(
      (resolve, reject) => writeFile(fullpath, obj,
        (err) => {
          if (err) {
            reject(err);
          } else {
            // if a platform is not Windows(include x64)
            if ('win32' !== process.platform) {
              // same as chmod 600
              chmodSync(fullpath, constants.S_IRUSR | constants.S_IWUSR);
            }
            resolve(obj);
          }
        },
      ),
    ),
    delete: () => new Promise<void>((resolve) => {
      unlinkSync(fullpath);
      resolve();
    }),
  };
};
