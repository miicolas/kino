import "server-only";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { getMediaRoot } from "./media-root";
import {
  type PathValidationFailureReason,
  validateLibraryPath,
} from "./validate-library-path";

export type DirectoryEntry = { name: string; path: string };

export type ListDirectoriesResult =
  | { ok: true; entries: DirectoryEntry[] }
  | { ok: false; reason: PathValidationFailureReason };

export async function listDirectories(
  inputPath: string
): Promise<ListDirectoriesResult> {
  const validation = await validateLibraryPath(inputPath || ".");

  if (!validation.ok) {
    return { ok: false, reason: validation.reason };
  }

  const mediaRoot = getMediaRoot();
  const dirents = await readdir(validation.absolutePath, {
    withFileTypes: true,
  });

  const entries = dirents
    .filter((dirent) => dirent.isDirectory() && !dirent.name.startsWith("."))
    .map((dirent) => ({
      name: dirent.name,
      path: path.relative(
        mediaRoot,
        path.join(validation.absolutePath, dirent.name)
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return { ok: true, entries };
}
