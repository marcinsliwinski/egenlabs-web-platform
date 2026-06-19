export const STORAGE_ROOT: string;

export function resolveStoragePath(storagePath: string): string | null;

export function isValidStoragePath(storagePath: string): boolean;

export function resolveExistingStorageFile(storagePath: string): Promise<string | null>;
