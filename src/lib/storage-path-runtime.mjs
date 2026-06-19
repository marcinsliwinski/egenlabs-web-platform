import { realpath } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep, win32 } from 'node:path';

const STORAGE_DIRECTORY_NAME = 'storage';

export const STORAGE_ROOT = resolve(
  /* turbopackIgnore: true */ process.cwd(),
  STORAGE_DIRECTORY_NAME
);

function isPathInsideRoot(rootPath, candidatePath) {
  const relativePath = relative(rootPath, candidatePath);

  return (
    relativePath.length > 0 &&
    relativePath !== '..' &&
    !relativePath.startsWith(`..${sep}`) &&
    !isAbsolute(relativePath)
  );
}

export function resolveStoragePath(storagePath) {
  const trimmedPath = storagePath.trim();

  if (
    trimmedPath.length === 0 ||
    trimmedPath.includes('\0') ||
    isAbsolute(trimmedPath) ||
    win32.isAbsolute(trimmedPath)
  ) {
    return null;
  }

  const portablePath = trimmedPath.replaceAll('\\', '/');
  const segments = portablePath.split('/').filter(Boolean);

  if (segments[0] !== STORAGE_DIRECTORY_NAME || segments.length < 2) {
    return null;
  }

  const candidatePath = resolve(STORAGE_ROOT, ...segments.slice(1));

  return isPathInsideRoot(STORAGE_ROOT, candidatePath) ? candidatePath : null;
}

export function isValidStoragePath(storagePath) {
  return resolveStoragePath(storagePath) !== null;
}

export async function resolveExistingStorageFile(storagePath) {
  const candidatePath = resolveStoragePath(storagePath);

  if (!candidatePath) {
    return null;
  }

  try {
    const [realStorageRoot, realCandidatePath] = await Promise.all([
      realpath(STORAGE_ROOT),
      realpath(candidatePath)
    ]);

    return isPathInsideRoot(realStorageRoot, realCandidatePath) ? realCandidatePath : null;
  } catch {
    return null;
  }
}
