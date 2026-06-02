import "server-only";
import { constants as fsConstants } from "node:fs";
import { access, stat } from "node:fs/promises";
import path from "node:path";
import { getErrorCode } from "../error-code";
import { getMediaRoot } from "./media-root";

export type PathValidationFailureReason =
  | "OUTSIDE_ROOT"
  | "NOT_FOUND"
  | "NOT_A_DIRECTORY"
  | "NOT_READABLE";

export type PathValidationResult =
  | { ok: true; absolutePath: string }
  | { ok: false; reason: PathValidationFailureReason };

export async function validateLibraryPath(
  inputPath: string
): Promise<PathValidationResult> {
  const mediaRoot = getMediaRoot();

  const candidate = path.isAbsolute(inputPath)
    ? path.resolve(inputPath)
    : path.resolve(mediaRoot, inputPath);

  const rel = path.relative(mediaRoot, candidate);
  const isInsideRoot =
    candidate === mediaRoot ||
    (rel !== "" && !rel.startsWith("..") && !path.isAbsolute(rel));

  if (!isInsideRoot) {
    return { ok: false, reason: "OUTSIDE_ROOT" };
  }

  let stats: Awaited<ReturnType<typeof stat>>;
  try {
    stats = await stat(candidate);
  } catch (error) {
    if (getErrorCode(error) === "ENOENT") {
      return { ok: false, reason: "NOT_FOUND" };
    }
    if (getErrorCode(error) === "EACCES") {
      return { ok: false, reason: "NOT_READABLE" };
    }
    throw error;
  }

  if (!stats.isDirectory()) {
    return { ok: false, reason: "NOT_A_DIRECTORY" };
  }

  try {
    // biome-ignore lint/suspicious/noBitwiseOperators: masque de bits fs (R_OK|X_OK)
    await access(candidate, fsConstants.R_OK | fsConstants.X_OK);
  } catch (error) {
    if (getErrorCode(error) === "EACCES") {
      return { ok: false, reason: "NOT_READABLE" };
    }
    if (getErrorCode(error) === "ENOENT") {
      return { ok: false, reason: "NOT_FOUND" };
    }
    throw error;
  }

  return { ok: true, absolutePath: candidate };
}
