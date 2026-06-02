"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
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
import { Input } from "@repo/ui/components/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient, useSession } from "@/lib/auth-client";

const nameSchema = z.object({
  name: z.string().trim().min(1, "Nom requis"),
});

type NameValues = z.infer<typeof nameSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mot de passe actuel requis"),
    newPassword: z
      .string()
      .min(8, "Le nouveau mot de passe doit faire au moins 8 caractères"),
    confirmPassword: z.string().min(1, "Confirmation requise"),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type PasswordValues = z.infer<typeof passwordSchema>;

function ProfileCard() {
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<NameValues>({
    resolver: zodResolver(nameSchema),
    values: { name: session?.user.name ?? "" },
  });

  async function onSubmit(values: NameValues) {
    setError(null);
    setSaved(false);
    setIsSaving(true);

    const result = await authClient.updateUser({ name: values.name });

    setIsSaving(false);

    if (result.error) {
      setError(result.error.message ?? "Impossible de mettre à jour le nom.");
      return;
    }

    setSaved(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profil</CardTitle>
        <CardDescription>
          {session?.user.email
            ? `Connecté en tant que ${session.user.email}.`
            : "Modifiez votre nom affiché."}
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="name"
                      className="h-11"
                      placeholder="Votre nom"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {saved && (
              <Alert>
                <AlertDescription>Nom mis à jour.</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="justify-end">
            <Button className="min-h-11" disabled={isSaving} type="submit">
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function PasswordCard() {
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: PasswordValues) {
    setError(null);
    setSaved(false);
    setIsSaving(true);

    const result = await authClient.changePassword({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
      revokeOtherSessions: true,
    });

    setIsSaving(false);

    if (result.error) {
      setError(
        result.error.message ?? "Impossible de modifier le mot de passe."
      );
      return;
    }

    setSaved(true);
    form.reset();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mot de passe</CardTitle>
        <CardDescription>
          Changez votre mot de passe. Les autres sessions seront déconnectées.
        </CardDescription>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de passe actuel</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="current-password"
                      className="h-11"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      className="h-11"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le nouveau mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      autoComplete="new-password"
                      className="h-11"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {saved && (
              <Alert>
                <AlertDescription>Mot de passe mis à jour.</AlertDescription>
              </Alert>
            )}
          </CardContent>

          <CardFooter className="justify-end">
            <Button className="min-h-11" disabled={isSaving} type="submit">
              {isSaving ? "Modification..." : "Modifier le mot de passe"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export function AccountSettings() {
  return (
    <div className="flex flex-col gap-8">
      <ProfileCard />
      <PasswordCard />
    </div>
  );
}
