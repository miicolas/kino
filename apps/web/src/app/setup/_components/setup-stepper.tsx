"use client";

import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Separator } from "@repo/ui/components/separator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, CircleAlert, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PAGES } from "@/constants/page";
import { orpc } from "@/orpc/client";
import { type SetupStep, setupParsers } from "../search-params";
import { LibraryStep } from "./library-step";
import { toServerInput } from "./server-form";
import { type ServerFormValues, ServerStep } from "./server-step";
import type { SetupConfig } from "./setup-types";
import { SummaryStep } from "./summary-step";

type SetupStepperProps = {
  hasValidRequestedStep: boolean;
  initialConfig: SetupConfig;
};

const STEP_LABELS: Record<SetupStep, string> = {
  server: "Serveur",
  libraries: "Bibliothèques",
  summary: "Récapitulatif",
};

export function SetupStepper({
  hasValidRequestedStep,
  initialConfig,
}: SetupStepperProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [step, setStep] = useQueryState("step", setupParsers.step);
  const [config, setConfig] = useState(initialConfig);
  const [serverError, setServerError] = useState<string | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [completeError, setCompleteError] = useState<string | null>(null);
  const requestedStepHandled = useRef(hasValidRequestedStep);
  const restartedScanIds = useRef(new Set<string>());

  const librariesQueryOptions = orpc.library.list.queryOptions({
    input: undefined,
    retry: false,
    refetchInterval: (query) =>
      query.state.data?.some((library) => library.scanStatus === "pending")
        ? 500
        : false,
  });

  const { data: libraries = [] } = useQuery(librariesQueryOptions);

  const saveSetup = useMutation(orpc.config.saveSetup.mutationOptions());
  const startScan = useMutation(orpc.library.scan.mutationOptions());
  const deleteLibrary = useMutation(orpc.library.delete.mutationOptions());
  const completeSetup = useMutation(orpc.config.complete.mutationOptions());

  const allScansCompleted =
    libraries.length > 0 &&
    libraries.every((library) => library.scanStatus === "completed");
  const canOpenLibraries = config !== null;
  const canOpenSummary = canOpenLibraries && allScansCompleted;

  const isStepAllowed = useCallback(
    (target: SetupStep) =>
      target === "server" ||
      (target === "libraries" && canOpenLibraries) ||
      (target === "summary" && canOpenSummary),
    [canOpenLibraries, canOpenSummary]
  );

  const recommendedStep = useMemo<SetupStep>(() => {
    if (!canOpenLibraries) {
      return "server";
    }
    return canOpenSummary ? "summary" : "libraries";
  }, [canOpenLibraries, canOpenSummary]);

  const invalidateLibraries = useCallback(async () => {
    await queryClient.invalidateQueries({
      queryKey: orpc.library.list.queryOptions({ input: undefined }).queryKey,
    });
  }, [queryClient]);

  useEffect(() => {
    if (
      !(requestedStepHandled.current && isStepAllowed(step)) &&
      step !== recommendedStep
    ) {
      requestedStepHandled.current = true;
      setStep(recommendedStep, { history: "replace" }).catch(() => {
        setScanError("Impossible de mettre à jour l’étape affichée.");
      });
      return;
    }

    requestedStepHandled.current = true;
  }, [isStepAllowed, recommendedStep, setStep, step]);

  useEffect(() => {
    if (step !== "libraries") {
      return;
    }

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
  }, [invalidateLibraries, libraries, startScan, step]);

  function handleSaveServer(values: ServerFormValues) {
    setServerError(null);
    saveSetup.mutate(toServerInput(values), {
      onSuccess: (savedConfig) => {
        setConfig(savedConfig);
        setStep("libraries").catch(() => {
          setServerError("Impossible d’afficher l’étape suivante.");
        });
      },
      onError: (error) => {
        setServerError(
          error.message ?? "Impossible d’enregistrer la configuration."
        );
      },
    });
  }

  function handleDeleteLibrary(libraryId: string) {
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

  function handleComplete() {
    setCompleteError(null);
    completeSetup.mutate(undefined, {
      onSuccess: () => {
        router.push(PAGES.HUB);
        router.refresh();
      },
      onError: (error) => {
        setCompleteError(
          error.message ?? "Impossible de terminer la configuration."
        );
      },
    });
  }

  function handleStepChange(nextStep: SetupStep) {
    if (isStepAllowed(nextStep)) {
      setStep(nextStep).catch(() => {
        setScanError("Impossible de mettre à jour l’étape affichée.");
      });
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-muted/40 p-4 sm:p-6">
      <Card className="w-full max-w-4xl">
        <CardHeader className="gap-1">
          <p className="font-medium text-primary text-sm">Kino</p>
          <CardTitle>
            <h1 className="font-semibold text-2xl">Configurer votre serveur</h1>
          </CardTitle>
          <CardDescription>
            Quelques étapes suffisent avant de profiter de votre catalogue.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          <nav aria-label="Étapes de configuration">
            <ol className="grid grid-cols-3 gap-2">
              {(Object.keys(STEP_LABELS) as SetupStep[]).map(
                (itemStep, index) => {
                  const isCurrent = itemStep === step;
                  const isAvailable = isStepAllowed(itemStep);
                  const isCompleted =
                    (itemStep === "server" && canOpenLibraries) ||
                    (itemStep === "libraries" && canOpenSummary);

                  return (
                    <li key={itemStep}>
                      <Button
                        aria-current={isCurrent ? "step" : undefined}
                        className="h-auto min-h-11 w-full justify-start px-2 sm:px-3"
                        disabled={!isAvailable}
                        onClick={() => handleStepChange(itemStep)}
                        type="button"
                        variant={isCurrent ? "secondary" : "ghost"}
                      >
                        <Badge
                          aria-hidden="true"
                          className="size-6 rounded-full p-0"
                          variant={
                            isCurrent || isCompleted ? "default" : "secondary"
                          }
                        >
                          {isCompleted ? (
                            <Check aria-hidden="true" className="size-3.5" />
                          ) : (
                            index + 1
                          )}
                        </Badge>
                        <span className="sr-only truncate sm:not-sr-only sm:inline">
                          {STEP_LABELS[itemStep]}
                        </span>
                      </Button>
                    </li>
                  );
                }
              )}
            </ol>
          </nav>

          <Separator />

          {scanError && step === "libraries" && (
            <Alert variant="destructive">
              <CircleAlert aria-hidden="true" />
              <AlertDescription>{scanError}</AlertDescription>
            </Alert>
          )}

          {step === "server" && (
            <ServerStep
              config={config}
              error={serverError}
              isSaving={saveSetup.isPending}
              onSubmit={handleSaveServer}
            />
          )}

          {step === "libraries" && (
            <LibraryStep
              isDeleting={deleteLibrary.isPending}
              libraries={libraries}
              onBack={() => handleStepChange("server")}
              onContinue={() => handleStepChange("summary")}
              onDelete={handleDeleteLibrary}
              onLibrariesChanged={invalidateLibraries}
            />
          )}

          {step === "summary" && config && canOpenSummary && (
            <SummaryStep
              config={config}
              error={completeError}
              isCompleting={completeSetup.isPending}
              libraries={libraries}
              onBack={() => handleStepChange("libraries")}
              onComplete={handleComplete}
            />
          )}

          {startScan.isPending && step === "libraries" && (
            <Alert>
              <Loader2
                aria-hidden="true"
                className="animate-spin motion-reduce:animate-none"
              />
              <AlertDescription>
                Relance des scans en attente...
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
