import test from 'ava';
import dotf from '.';

let dotglobal = dotf('~', 'myrc'); // Global (~)
let dotlocal = dotf(__dirname, 'myignore'); // Local (./)

// Creates
test('write', async t => {
  // overwrite data
  var writeGlobal = await dotglobal.write({a: 1});
  var writeLocal = await dotlocal.write({a: 1});
  t.pass();
});
test('exists', async t => {
  let existsGlobal = await dotglobal.exists();
  let existsLocal = await dotlocal.exists();
  t.pass();
});
test('read', async t => {
  var readGlobal = await dotglobal.read();
  var readLocal = await dotlocal.read();
  t.pass();
});
