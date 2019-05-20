declare const _default: (dirname: string, name: string) => {
    exists: () => Promise<boolean>;
    read: () => Promise<any>;
    write: <T extends any>(obj: T) => Promise<T>;
    delete: () => Promise<void>;
};
/**
 * Read, Write, or Exist Dotfiles
 * @param  {__dirname} dirname The relative dirname
 * @param  {string} name The dotfile name
 * @return {object} exists, read, or write Promises
 */
export default _default;
