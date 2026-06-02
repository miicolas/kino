import "server-only";

export type ScanStatus = "idle" | "pending" | "completed";

export type ScanState = {
  status: ScanStatus;
  startedAt: number | null;
  finishedAt: number | null;
};

const SCAN_COMPLETE_AFTER_MS = 2000;

// Attaché à globalThis pour survivre au rechargement de modules (HMR) en dev :
// sans ça, la Map est vidée à chaque édition et un scan en cours « disparaît ».
const globalForScan = globalThis as typeof globalThis & {
  __kinoScanStates?: Map<string, { startedAt: number }>;
};

if (!globalForScan.__kinoScanStates) {
  globalForScan.__kinoScanStates = new Map<string, { startedAt: number }>();
}

const states = globalForScan.__kinoScanStates;

export function startScan(libraryId: string): void {
  states.set(libraryId, { startedAt: Date.now() });
}

export function clearScanState(libraryId: string): void {
  states.delete(libraryId);
}

export function getScanState(libraryId: string): ScanState {
  const entry = states.get(libraryId);

  if (!entry) {
    return { status: "idle", startedAt: null, finishedAt: null };
  }

  const done = Date.now() - entry.startedAt >= SCAN_COMPLETE_AFTER_MS;

  if (done) {
    return {
      status: "completed",
      startedAt: entry.startedAt,
      finishedAt: entry.startedAt + SCAN_COMPLETE_AFTER_MS,
    };
  }

  return { status: "pending", startedAt: entry.startedAt, finishedAt: null };
}
