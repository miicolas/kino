import type { Library, ServerConfig } from "@repo/contract";

export type ScanStatus = "idle" | "pending" | "completed";

export type SetupLibrary = Library & {
  scanStatus: ScanStatus;
};

export type SetupConfig = ServerConfig | null;
