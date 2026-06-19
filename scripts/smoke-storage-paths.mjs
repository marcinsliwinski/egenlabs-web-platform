import assert from 'node:assert/strict';
import { relative } from 'node:path';

import {
  STORAGE_ROOT,
  isValidStoragePath,
  resolveStoragePath
} from '../src/lib/storage-path-runtime.mjs';

const acceptedPaths = [
  'storage/builds/fito-gen/1.0.0/fito-gen-1.0.0.exe',
  'storage/media/fito-gen-one-pager.pdf',
  'storage\\media\\fito-gen-one-pager.pdf'
];

const rejectedPaths = [
  '',
  'storage',
  'storage/',
  '../.env',
  'storage/../../.env',
  '/etc/passwd',
  'C:\\Windows\\System32\\drivers\\etc\\hosts',
  'storage-other/file.pdf'
];

for (const storagePath of acceptedPaths) {
  assert.equal(isValidStoragePath(storagePath), true, `Expected accepted path: ${storagePath}`);

  const resolvedPath = resolveStoragePath(storagePath);
  assert.ok(resolvedPath, `Expected a resolved path for: ${storagePath}`);
  assert.ok(!relative(STORAGE_ROOT, resolvedPath).startsWith('..'));
}

for (const storagePath of rejectedPaths) {
  assert.equal(isValidStoragePath(storagePath), false, `Expected rejected path: ${storagePath}`);
  assert.equal(resolveStoragePath(storagePath), null);
}

console.log('Storage path smoke test passed.');
