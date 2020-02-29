import { constants, promises } from 'graceful-fs';
import { readFile, writeFile } from 'jsonfile';

import { homedir } from 'os';
import { join } from 'path';

const { access, chmod, unlink } = promises;

/**
 * A convenient object to interact with dot files
 */
export interface Dotfile {
  exists: () => Promise<boolean>;
  read: <T>() => Promise<T>;
  write: <T>(obj: T) => Promise<T>;
  delete: () => Promise<void>;
}

/**
 * Delete, Read, Write, or Exist Dotfiles
 *
 * @param {__dirname} dirname The relative dirname
 * @param {string} name The dotfile name
 * @return {Dotfile} `delete`, `exists`, `read` and `write` Promises
 */
const dotf = (dirname: string, name: string): Dotfile => {
  if (!name || !dirname) {
    throw new Error('Both name and dirname parameters are required');
  }

  if (dirname[0] === '~') {
    dirname = homedir();
  }

  const fullpath = join(dirname, `.${name}`);

  return {
    delete: () => unlink(fullpath),
    exists: async () =>
      access(fullpath)
        .then(() => true)
        .catch(() => false),
    read: () => readFile(fullpath),
    write:
      process.platform === 'win32'
        ? // if a platform is not Windows(include x64)
          (obj) => writeFile(fullpath, obj).then(() => obj)
        : (obj) =>
            writeFile(fullpath, obj)
              // same as chmod 600
              .then(() => chmod(fullpath, constants.S_IRUSR | constants.S_IWUSR))
              .then(() => obj),
  };
};

export default dotf;

// For CommonJS default export support
module.exports = dotf;
Object.defineProperty(module.exports, 'default', { enumerable: false, value: dotf });
