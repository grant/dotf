import test from 'ava';
import fs from 'graceful-fs';
import { homedir } from 'os';
import { join } from 'path';

import dotf from '../src/index';

// Creates
// TODO Make this test simpler
test('write', async (t) => {
  // overwrite data
  const dotglobalfullpath = join(homedir(), '.myrc1');
  const dotlocalfullpath = join(__dirname, '.myignore1');
  const dotglobal = dotf('~', 'myrc1'); // Global (~)
  const dotlocal = dotf(__dirname, 'myignore1'); // Local (./)
  const writeGlobal = await dotglobal.write({a: 1});
  const writeLocal = await dotlocal.write({a: 1});

  // if a platform is not Windows(include x64)
  if ('win32' !== process.platform) {
    // If file permission is incorrect,
    // {{file permission value} logical AND {777 in octal}}
    // !== {correct permission value}.
    if ((fs.statSync(dotglobalfullpath).mode & 0o777) !== (fs.constants.S_IRUSR
      | fs.constants.S_IWUSR)) {
      t.fail();
    }
    if ((fs.statSync(dotlocalfullpath).mode & 0o777) !== (fs.constants.S_IRUSR
      | fs.constants.S_IWUSR)) {
      t.fail();
    }
  }
  t.pass();
  await dotglobal.delete();
  await dotlocal.delete();
});
test('exists', async (t) => {
  const dotglobal = dotf('~', 'myrc2'); // Global (~)
  const dotlocal = dotf(__dirname, 'myignore2'); // Local (./)
  await dotglobal.write({a: 1});
  await dotlocal.write({a: 1});
  const existsGlobal = await dotglobal.exists();
  const existsLocal = await dotlocal.exists();
  t.is(existsGlobal, true);
  t.is(existsLocal, true);
  t.pass();
  await dotglobal.delete();
  await dotlocal.delete();
});
test('read', async (t) => {
  const dotglobal = dotf('~', 'myrc3'); // Global (~)
  const dotlocal = dotf(__dirname, 'myignore3'); // Local (./)
  await dotglobal.write({a: 1});
  await dotlocal.write({b: 2});
  const readGlobal = await dotglobal.read();
  const readLocal = await dotlocal.read();
  t.deepEqual(readGlobal, {a: 1});
  t.deepEqual(readLocal, {b: 2});
  t.pass();
  await dotglobal.delete();
  await dotlocal.delete();
});
test('delete', async (t) => {
  const dotglobal = dotf('~', 'myrc4'); // Global (~)
  const dotlocal = dotf(__dirname, 'myignore4'); // Local (./)
  // Write then delete
  await dotglobal.write({a: 1});
  await dotglobal.delete();
  await dotlocal.write({b: 2});
  await dotlocal.delete();
  // Verify deleted
  await t.throwsAsync(async () => {
    await dotglobal.read();
  }, {instanceOf: Error, message: new RegExp('^ENOENT')});
  await t.throwsAsync(async () => {
    await dotlocal.read();
  }, {instanceOf: Error, message: new RegExp('^ENOENT')});
});
