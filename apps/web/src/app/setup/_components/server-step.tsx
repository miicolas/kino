"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Button } from "@repo/ui/components/button";
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
import { CircleAlert, Server, Subtitles } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  type ServerFormValues,
  serverFormSchema,
  toServerFormValues,
} from "./server-form";
import type { SetupConfig } from "./setup-types";

export type { ServerFormValues } from "./server-form";

type ServerStepProps = {
  config: SetupConfig;
  isSaving: boolean;
  error: string | null;
  onSubmit: (values: ServerFormValues) => void;
};

export function ServerStep({
  config,
  isSaving,
  error,
  onSubmit,
}: ServerStepProps) {
  const form = useForm<ServerFormValues>({
    resolver: zodResolver(serverFormSchema),
    defaultValues: toServerFormValues(config),
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-semibold text-xl">Configuration du serveur</h2>
          <p className="text-muted-foreground text-sm">
            Donnez un nom à votre serveur et choisissez les langues utilisées
            par défaut.
          </p>
        </div>

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
                <Select onValueChange={field.onChange} value={field.value}>
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

        {error && (
          <Alert variant="destructive">
            <CircleAlert aria-hidden="true" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end">
          <Button className="min-h-11" disabled={isSaving} type="submit">
            {isSaving ? "Enregistrement..." : "Continuer"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
