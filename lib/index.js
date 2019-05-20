"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const os_1 = require("os");
const path_1 = require("path");
const jsonfile_1 = require("jsonfile");
/**
 * Read, Write, or Exist Dotfiles
 * @param  {__dirname} dirname The relative dirname
 * @param  {string} name The dotfile name
 * @return {object} exists, read, or write Promises
 */
exports.default = (dirname, name) => {
    if (!name || !dirname) {
        throw new Error('Both name and dirname parameters are required');
    }
    if (dirname[0] === '~') {
        dirname = os_1.homedir();
    }
    const filename = `.${name}`;
    const fullpath = path_1.join(dirname, filename);
    return {
        exists: () => new Promise((resolve, reject) => {
            fs_1.exists(fullpath, resolve);
        }),
        read: () => new Promise((resolve, reject) => {
            jsonfile_1.readFile(fullpath, (err, obj) => {
                if (err)
                    return reject(err);
                resolve(obj);
            });
        }),
        write: (obj) => new Promise((resolve, reject) => {
            jsonfile_1.writeFile(fullpath, obj, (err) => {
                if (err)
                    return reject(err);
                // if a platform is not Windows(include x64)
                if ('win32' !== process.platform) {
                    // same as chmod 600
                    fs_1.chmodSync(fullpath, fs_1.constants.S_IRUSR | fs_1.constants.S_IWUSR);
                }
                resolve(obj);
            });
        }),
        delete: () => new Promise((resolve, reject) => {
            fs_1.unlinkSync(fullpath);
            resolve();
        }),
    };
};
