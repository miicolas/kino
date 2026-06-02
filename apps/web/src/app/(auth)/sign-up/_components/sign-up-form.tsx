"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@repo/ui/components/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group";
import { Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PAGES } from "@/constants/page";
import { authClient } from "@/lib/auth-client";
import { PasswordInput } from "../../_components/password-input";

const schema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/\d/, "Password must contain a number"),
});

type FormValues = z.infer<typeof schema>;

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  function onSubmit(values: FormValues) {
    setError(null);
    setIsLoading(true);

    authClient.signUp.email(
      {
        name: values.name,
        email: values.email,
        password: values.password,
        callbackURL: PAGES.SETUP,
      },
      {
        onError: (ctx) => {
          setIsLoading(false);
          setError(ctx.error.message ?? "An error occurred during sign up.");
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
        <label className="font-medium text-sm" htmlFor="name">
          Full name
        </label>
        <InputGroup aria-invalid={!!formState.errors.name || undefined}>
          <InputGroupAddon>
            <User className="size-4" />
          </InputGroupAddon>
          <InputGroupInput
            {...register("name")}
            id="name"
            placeholder="James Brown"
            type="text"
          />
        </InputGroup>
        {formState.errors.name && (
          <p className="text-destructive text-xs">
            {formState.errors.name.message}
          </p>
        )}
      </div>

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
          autoComplete="new-password"
          hasError={!!formState.errors.password}
          id="password"
        />
        {formState.errors.password ? (
          <p className="text-destructive text-xs">
            {formState.errors.password.message}
          </p>
        ) : (
          <p className="text-muted-foreground text-xs">
            At least 8 characters and one number.
          </p>
        )}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <Button disabled={isLoading} type="submit">
        {isLoading ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
