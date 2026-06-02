"use client";

import { Alert, AlertDescription } from "@repo/ui/components/alert";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { CircleAlert, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { LibraryStep } from "@/app/setup/_components/library-step";
import { orpc } from "@/orpc/client";

export function LibrarySettings() {
  const queryClient = useQueryClient();
  const [scanError, setScanError] = useState<string | null>(null);
  const restartedScanIds = useRef(new Set<string>());

  const { data: libraries } = useSuspenseQuery(
    orpc.library.list.queryOptions({
      input: undefined,
      retry: false,
      refetchInterval: (query) =>
        query.state.data?.some((library) => library.scanStatus === "pending")
          ? 500
          : false,
    })
  );

  const startScan = useMutation(orpc.library.scan.mutationOptions());
  const deleteLibrary = useMutation(orpc.library.delete.mutationOptions());

  const invalidateLibraries = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: orpc.library.list.queryOptions({ input: undefined }).queryKey,
    });
  }, [queryClient]);

  // Relance automatiquement les scans laissés en attente (état "idle").
  useEffect(() => {
    for (const library of libraries) {
      if (
        library.scanStatus !== "idle" ||
        restartedScanIds.current.has(library.id)
      ) {
        continue;
      }

      restartedScanIds.current.add(library.id);
      startScan.mutate(
        { libraryId: library.id },
        {
          onError: (error) => {
            setScanError(
              error.message ?? "Impossible de relancer un scan en attente."
            );
          },
          onSettled: () => {
            invalidateLibraries().catch(() => {
              setScanError("Impossible d’actualiser les bibliothèques.");
            });
          },
        }
      );
    }
  }, [invalidateLibraries, libraries, startScan]);

  function handleDelete(libraryId: string) {
    setScanError(null);
    deleteLibrary.mutate(
      { libraryId },
      {
        onSuccess: () => {
          restartedScanIds.current.delete(libraryId);
          invalidateLibraries().catch(() => {
            setScanError("Impossible d’actualiser les bibliothèques.");
          });
        },
        onError: (error) => {
          setScanError(
            error.message ?? "Impossible de supprimer la bibliothèque."
          );
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {scanError && (
        <Alert variant="destructive">
          <CircleAlert aria-hidden="true" />
          <AlertDescription>{scanError}</AlertDescription>
        </Alert>
      )}

      <LibraryStep
        isDeleting={deleteLibrary.isPending}
        libraries={libraries}
        onDelete={handleDelete}
        onLibrariesChanged={invalidateLibraries}
      />

      {startScan.isPending && (
        <Alert>
          <Loader2
            aria-hidden="true"
            className="animate-spin motion-reduce:animate-none"
          />
          <AlertDescription>Relance des scans en attente...</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
