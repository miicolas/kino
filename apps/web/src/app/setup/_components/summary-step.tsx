"use client";

import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  CheckCircle2,
  CircleAlert,
  Library,
  Server,
  Subtitles,
} from "lucide-react";
import { LIBRARY_TYPE_LABELS } from "./library-types";
import type { SetupConfig, SetupLibrary } from "./setup-types";

type SummaryStepProps = {
  config: Exclude<SetupConfig, null>;
  libraries: SetupLibrary[];
  error: string | null;
  isCompleting: boolean;
  onBack: () => void;
  onComplete: () => void;
};

const LANGUAGE_LABELS = {
  fr: "Français",
  en: "Anglais",
} as const;

export function SummaryStep({
  config,
  libraries,
  error,
  isCompleting,
  onBack,
  onComplete,
}: SummaryStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="font-semibold text-xl">Tout est prêt</h2>
        <p className="text-muted-foreground text-sm">
          Vérifiez votre configuration avant d’ouvrir Kino.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card
          aria-labelledby="server-summary"
          className="gap-3 py-4 shadow-none"
        >
          <CardHeader className="px-4">
            <CardTitle
              className="flex items-center gap-2 text-sm"
              id="server-summary"
            >
              <Server aria-hidden="true" className="size-4" />
              Serveur
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <dl className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Nom</dt>
                <dd className="font-medium">{config.serverName}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted-foreground">Métadonnées</dt>
                <dd className="font-medium">
                  {LANGUAGE_LABELS[config.defaultLanguage as "fr" | "en"]}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="flex items-center gap-1 text-muted-foreground">
                  <Subtitles aria-hidden="true" className="size-3.5" />
                  Sous-titres
                </dt>
                <dd className="font-medium">
                  {config.defaultSubtitleLanguage
                    ? LANGUAGE_LABELS[
                        config.defaultSubtitleLanguage as "fr" | "en"
                      ]
                    : "Aucun"}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card
          aria-labelledby="library-summary"
          className="gap-3 py-4 shadow-none"
        >
          <CardHeader className="px-4">
            <CardTitle
              className="flex items-center gap-2 text-sm"
              id="library-summary"
            >
              <Library aria-hidden="true" className="size-4" />
              Bibliothèques
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4">
            <ul className="flex flex-col gap-2">
              {libraries.map((library) => (
                <li
                  className="flex items-center gap-2 text-sm"
                  key={library.id}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-4 shrink-0 text-green-600"
                  />
                  <span className="min-w-0 flex-1 truncate">
                    {library.name}
                  </span>
                  <Badge variant="secondary">
                    {LIBRARY_TYPE_LABELS[library.type]}
                  </Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Alert variant="destructive">
          <CircleAlert aria-hidden="true" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap justify-between gap-3">
        <Button
          className="min-h-11"
          onClick={onBack}
          type="button"
          variant="ghost"
        >
          Retour
        </Button>
        <Button
          className="min-h-11"
          disabled={isCompleting}
          onClick={onComplete}
          type="button"
        >
          {isCompleting ? "Finalisation..." : "Terminer la configuration"}
        </Button>
      </div>
    </div>
  );
}
