import process from 'node:process';
import { homedir } from 'node:os';
import { join } from 'node:path';
import fs from 'graceful-fs';
import jsonfile from 'jsonfile';

const { constants, promises } = fs;
const { access, chmod, unlink } = promises;
const { readFile, writeFile } = jsonfile;

/**
 * A convenient object to interact with dot files
 */
export interface Dotfile {
  /** Delete the file */
  delete: () => Promise<void>;
  /** Check if the file exists */
  exists: () => Promise<boolean>;
  /** Read the content of the file */
  read: <T = Record<string, unknown>>() => Promise<T>;
  /** Write the content of the file */
  write: <T = Record<string, unknown>>(object: T) => Promise<T>;
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

  if (dirname.startsWith('~')) {
    dirname = homedir();
  }

  const fullpath = join(dirname, `.${name}`);

  return {
    delete: async () => unlink(fullpath),
    exists: async () => {
      try {
        await access(fullpath);
        return true;
      } catch {
        return false;
      }
    },
    read: async () => readFile(fullpath),
    write:
      process.platform === 'win32'
        ? // If a platform is not Windows(include x64)
          async (object) => {
            await writeFile(fullpath, object);
            return object;
          }
        : async (object) => {
            await writeFile(fullpath, object);
            // Same as chmod 600
            await chmod(fullpath, constants.S_IRUSR | constants.S_IWUSR);
            return object;
          },
  };
};

export default dotf;
