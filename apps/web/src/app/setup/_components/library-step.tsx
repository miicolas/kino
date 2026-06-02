"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group";
import { Label } from "@repo/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";
import { useMutation } from "@tanstack/react-query";
import {
  CheckCircle2,
  CircleAlert,
  FolderOpen,
  Loader2,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { orpc } from "@/orpc/client";
import { FolderPicker } from "./folder-picker";
import { LIBRARY_TYPES } from "./library-types";
import type { SetupLibrary } from "./setup-types";

const schema = z.object({
  name: z.string().trim().min(1, "Nom requis"),
  path: z.string().trim().min(1, "Sélectionnez un dossier"),
  type: z.enum(["movie", "series", "documentary"]),
});

type FormValues = z.infer<typeof schema>;

type LibraryStepProps = {
  libraries: SetupLibrary[];
  isDeleting: boolean;
  // Optionnels : absents en mode édition (Settings), où il n'y a pas d'étapes.
  onBack?: () => void;
  onContinue?: () => void;
  onDelete: (libraryId: string) => void;
  onLibrariesChanged: () => Promise<void>;
};

const PATH_ERROR_MESSAGES: Record<string, string> = {
  OUTSIDE_ROOT: "Ce dossier est hors de la racine média autorisée.",
  NOT_FOUND: "Ce dossier n'existe pas.",
  NOT_A_DIRECTORY: "Ce chemin n'est pas un dossier.",
  NOT_READABLE: "Ce dossier n'est pas lisible.",
};

function getScanLabel(status: SetupLibrary["scanStatus"]) {
  if (status === "completed") {
    return "Scan terminé";
  }
  if (status === "pending") {
    return "Scan en cours";
  }
  return "Scan en attente";
}

export function LibraryStep({
  libraries,
  isDeleting,
  onBack,
  onContinue,
  onDelete,
  onLibrariesChanged,
}: LibraryStepProps) {
  const [formError, setFormError] = useState<string | null>(null);

  const { register, control, handleSubmit, reset, setValue, watch, formState } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: { name: "", path: "", type: "movie" },
    });

  const selectedPath = watch("path");
  const selectedType = watch("type");

  const validatePath = useMutation(orpc.library.validatePath.mutationOptions());
  const createLibrary = useMutation(orpc.library.create.mutationOptions());
  const startScan = useMutation(orpc.library.scan.mutationOptions());

  const allScansCompleted =
    libraries.length > 0 &&
    libraries.every((library) => library.scanStatus === "completed");

  function handleSelectPath(relativePath: string) {
    setValue("path", relativePath, { shouldValidate: true });
    validatePath.mutate({ path: relativePath });
  }

  function onSubmit(values: FormValues) {
    setFormError(null);
    createLibrary.mutate(values, {
      onSuccess: (created) => {
        if (!created) {
          setFormError("Création impossible.");
          return;
        }

        startScan.mutate(
          { libraryId: created.id },
          {
            onError: (error) => {
              setFormError(error.message ?? "Impossible de démarrer le scan.");
            },
            onSettled: () => {
              reset({ name: "", path: "", type: "movie" });
              validatePath.reset();
              onLibrariesChanged().catch(() => {
                setFormError("Impossible d’actualiser les bibliothèques.");
              });
            },
          }
        );
      },
      onError: (error) => {
        setFormError(error.message ?? "Impossible de créer la bibliothèque.");
      },
    });
  }

  const pathValidation = validatePath.data;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-xl">Bibliothèques</h2>
        <p className="text-muted-foreground text-sm">
          Ajoutez un dossier par catalogue. Vous pourrez continuer une fois tous
          les scans terminés.
        </p>
      </div>

      {libraries.length > 0 && (
        <section
          aria-labelledby="added-libraries"
          className="flex flex-col gap-3"
        >
          <h3 className="font-medium text-sm" id="added-libraries">
            Bibliothèques ajoutées
          </h3>
          <ul className="flex flex-col gap-2">
            {libraries.map((library) => (
              <li key={library.id}>
                <Card className="gap-0 py-0 shadow-none">
                  <CardContent className="flex items-center gap-3 p-3">
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-medium text-sm">
                          {library.name}
                        </span>
                        <Badge variant="secondary">
                          {
                            LIBRARY_TYPES.find(
                              (type) => type.value === library.type
                            )?.label
                          }
                        </Badge>
                      </div>
                      <span className="truncate text-muted-foreground text-xs">
                        {library.path}
                      </span>
                      <Badge
                        className={
                          library.scanStatus === "completed"
                            ? "border-green-600/20 bg-green-600/10 text-green-700 dark:text-green-400"
                            : undefined
                        }
                        variant="outline"
                      >
                        {library.scanStatus === "completed" ? (
                          <CheckCircle2 aria-hidden="true" />
                        ) : (
                          <Loader2
                            aria-hidden="true"
                            className="animate-spin motion-reduce:animate-none"
                          />
                        )}
                        {getScanLabel(library.scanStatus)}
                      </Badge>
                    </div>
                    <Button
                      aria-label={`Supprimer la bibliothèque ${library.name}`}
                      className="min-h-11 min-w-11"
                      disabled={isDeleting}
                      onClick={() => onDelete(library.id)}
                      size="icon"
                      type="button"
                      variant="ghost"
                    >
                      <Trash2 aria-hidden="true" className="size-4" />
                    </Button>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="gap-5 py-5 shadow-none">
          <CardHeader className="gap-1 px-5">
            <CardTitle>Ajouter une bibliothèque</CardTitle>
            <CardDescription>
              Choisissez son type, son nom et le dossier à analyser.
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-5 px-5">
            <fieldset className="flex flex-col gap-2">
              <legend className="font-medium text-sm">Type de contenu</legend>
              <Controller
                control={control}
                name="type"
                render={({ field }) => (
                  <RadioGroup
                    className="grid gap-2 sm:grid-cols-3"
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    {LIBRARY_TYPES.map((type) => {
                      const Icon = type.icon;
                      const id = `library-type-${type.value}`;

                      return (
                        <Label
                          className={
                            selectedType === type.value
                              ? "min-h-28 cursor-pointer items-start rounded-lg border border-primary bg-primary/5 p-3 ring-2 ring-primary/20"
                              : "min-h-28 cursor-pointer items-start rounded-lg border p-3 transition-colors hover:bg-accent/50"
                          }
                          htmlFor={id}
                          key={type.value}
                        >
                          <span className="flex flex-1 flex-col gap-1">
                            <Icon aria-hidden="true" className="size-5" />
                            <span className="font-medium text-sm">
                              {type.label}
                            </span>
                            <span className="text-muted-foreground text-xs">
                              {type.example}
                            </span>
                          </span>
                          <RadioGroupItem id={id} value={type.value} />
                        </Label>
                      );
                    })}
                  </RadioGroup>
                )}
              />
            </fieldset>

            <div className="flex flex-col gap-1">
              <Label htmlFor="library-name">Nom de la bibliothèque</Label>
              <InputGroup
                aria-invalid={!!formState.errors.name || undefined}
                className="h-11"
              >
                <InputGroupInput
                  {...register("name")}
                  aria-invalid={!!formState.errors.name || undefined}
                  autoComplete="off"
                  id="library-name"
                  placeholder={
                    LIBRARY_TYPES.find((type) => type.value === selectedType)
                      ?.label
                  }
                  spellCheck={false}
                  type="text"
                />
              </InputGroup>
              {formState.errors.name && (
                <p className="text-destructive text-xs">
                  {formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label>Dossier</Label>
              <FolderPicker
                onSelect={handleSelectPath}
                selectedPath={selectedPath}
              />
              <InputGroup
                aria-invalid={!!formState.errors.path || undefined}
                className="h-11"
              >
                <InputGroupAddon>
                  <FolderOpen aria-hidden="true" className="size-4" />
                </InputGroupAddon>
                <InputGroupInput
                  {...register("path")}
                  aria-invalid={!!formState.errors.path || undefined}
                  placeholder="Sélectionnez un dossier ci-dessus"
                  readOnly
                />
              </InputGroup>
              {formState.errors.path && (
                <p className="text-destructive text-xs">
                  {formState.errors.path.message}
                </p>
              )}
              {pathValidation?.ok === false && (
                <Alert variant="destructive">
                  <CircleAlert aria-hidden="true" />
                  <AlertDescription>
                    {PATH_ERROR_MESSAGES[pathValidation.reason] ??
                      "Dossier invalide."}
                  </AlertDescription>
                </Alert>
              )}
              {pathValidation?.ok === true && (
                <Alert>
                  <CheckCircle2 aria-hidden="true" />
                  <AlertDescription>Dossier valide</AlertDescription>
                </Alert>
              )}
            </div>

            {formError && (
              <Alert variant="destructive">
                <CircleAlert aria-hidden="true" />
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="justify-end px-5">
            <Button
              className="min-h-11"
              disabled={createLibrary.isPending || startScan.isPending}
              type="submit"
              variant="secondary"
            >
              {createLibrary.isPending || startScan.isPending
                ? "Ajout..."
                : "Ajouter la bibliothèque"}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {(onBack || onContinue) && (
        <div className="flex flex-wrap justify-between gap-3">
          {onBack && (
            <Button
              className="min-h-11"
              onClick={onBack}
              type="button"
              variant="ghost"
            >
              Retour
            </Button>
          )}
          {onContinue && (
            <Button
              className="min-h-11"
              disabled={!allScansCompleted}
              onClick={onContinue}
              type="button"
            >
              Continuer
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
