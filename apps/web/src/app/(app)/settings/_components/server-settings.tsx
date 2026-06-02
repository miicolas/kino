"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  CircleAlert,
  Server,
  Subtitles,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  type ServerFormValues,
  serverFormSchema,
  toServerFormValues,
  toServerInput,
} from "@/app/setup/_components/server-form";
import { PAGES } from "@/constants/page";
import { orpc } from "@/orpc/client";

export function ServerSettings() {
  const router = useRouter();
  const { data: config } = useSuspenseQuery(
    orpc.config.getSetup.queryOptions({ input: undefined })
  );

  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const saveSetup = useMutation(orpc.config.saveSetup.mutationOptions());
  const resetServer = useMutation(orpc.config.resetServer.mutationOptions());

  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: toServerFormValues(config),
  });

  function onSubmit(values: ServerFormValues) {
    setSaveError(null);
    setSaved(false);
    saveSetup.mutate(toServerInput(values), {
      onSuccess: (savedConfig) => {
        setSaved(true);
        form.reset(toServerFormValues(savedConfig));
      },
      onError: (error) => {
        setSaveError(
          error.message ?? "Impossible d’enregistrer la configuration."
        );
      },
    });
  }

  function handleReset() {
    setResetError(null);
    resetServer.mutate(undefined, {
      onSuccess: () => {
        router.push(PAGES.SETUP);
        router.refresh();
      },
      onError: (error) => {
        setResetError(
          error.message ?? "Impossible de réinitialiser le serveur."
        );
      },
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Serveur</CardTitle>
          <CardDescription>
            Modifiez le nom du serveur et les langues utilisées par défaut.
          </CardDescription>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="serverName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom du serveur</FormLabel>
                    <InputGroup className="h-11">
                      <InputGroupAddon>
                        <Server aria-hidden="true" className="size-4" />
                      </InputGroupAddon>
                      <FormControl>
                        <InputGroupInput
                          {...field}
                          autoComplete="off"
                          placeholder="Kino"
                          spellCheck={false}
                          type="text"
                        />
                      </FormControl>
                    </InputGroup>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="defaultLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Langue des métadonnées</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Choisir une langue" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">Anglais</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultSubtitleLanguage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <Subtitles aria-hidden="true" className="size-4" />
                        Sous-titres par défaut
                      </FormLabel>
                      <Select
                        onValueChange={(value) =>
                          field.onChange(value === "none" ? "" : value)
                        }
                        value={field.value === "" ? "none" : field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Aucun" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">Aucun</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">Anglais</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {saveError && (
                <Alert variant="destructive">
                  <CircleAlert aria-hidden="true" />
                  <AlertDescription>{saveError}</AlertDescription>
                </Alert>
              )}

              {saved && (
                <Alert>
                  <CheckCircle2 aria-hidden="true" />
                  <AlertDescription>
                    Configuration enregistrée.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>

            <CardFooter className="justify-end">
              <Button
                className="min-h-11"
                disabled={saveSetup.isPending}
                type="submit"
              >
                {saveSetup.isPending ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Zone de danger</CardTitle>
          <CardDescription>
            Supprime la configuration du serveur et toutes les bibliothèques,
            puis relance l’assistant de configuration. Cette action est
            irréversible.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {resetError && (
            <Alert variant="destructive">
              <CircleAlert aria-hidden="true" />
              <AlertDescription>{resetError}</AlertDescription>
            </Alert>
          )}
          <div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="min-h-11" variant="destructive">
                  Supprimer la configuration du serveur
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogMedia className="bg-destructive/10 text-destructive">
                    <TriangleAlert aria-hidden="true" />
                  </AlertDialogMedia>
                  <AlertDialogTitle>
                    Réinitialiser le serveur ?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    La configuration du serveur et toutes les bibliothèques
                    seront définitivement supprimées. Vous serez redirigé vers
                    l’assistant de configuration pour repartir de zéro.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={resetServer.isPending}>
                    Annuler
                  </AlertDialogCancel>
                  <AlertDialogAction
                    disabled={resetServer.isPending}
                    onClick={(event) => {
                      event.preventDefault();
                      handleReset();
                    }}
                    variant="destructive"
                  >
                    {resetServer.isPending
                      ? "Suppression..."
                      : "Supprimer et relancer"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
