"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PAGES } from "@/constants/page";
import { authClient } from "@/lib/auth-client";
import { PasswordInput } from "../../_components/password-input";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof schema>;

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: FormValues) {
    setError(null);
    setIsLoading(true);

    authClient.signIn.email(
      {
        email: values.email,
        password: values.password,
        callbackURL: PAGES.HUB,
      },
      {
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message ?? "Invalid email or password.");
        },
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  }

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col gap-1">
        <label className="font-medium text-sm" htmlFor="email">
          Email
        </label>
        <InputGroup aria-invalid={!!formState.errors.email || undefined}>
          <InputGroupAddon>
            <Mail className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            {...register("email")}
            autoComplete="email"
            id="email"
            placeholder="hello@example.com"
            type="email"
          />
        </InputGroup>
        {formState.errors.email && (
          <p className="text-destructive text-xs">
            {formState.errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="font-medium text-sm" htmlFor="password">
          Password
        </label>
        <PasswordInput
          {...register("password")}
          autoComplete="current-password"
          hasError={!!formState.errors.password}
          id="password"
        />
        {formState.errors.password && (
          <p className="text-destructive text-xs">
            {formState.errors.password.message}
          </p>
        )}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button disabled={isLoading} type="submit">
        {isLoading ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
