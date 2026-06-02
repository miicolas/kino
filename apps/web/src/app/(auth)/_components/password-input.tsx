"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@repo/ui/components/input-group";
import { Eye, EyeOff, Lock } from "lucide-react";
import React from "react";

type PasswordInputProps = Omit<
  React.ComponentProps<typeof InputGroupInput>,
  "type"
> & {
  hasError?: boolean;
};

export function PasswordInput({ hasError, ...props }: PasswordInputProps) {
  const [show, setShow] = React.useState(false);

  return (
    <InputGroup aria-invalid={hasError || undefined}>
      <InputGroupAddon>
        <Lock className="size-4" />
      </InputGroupAddon>
      <InputGroupInput
        placeholder="••••••••••"
        type={show ? "text" : "password"}
        {...props}
      />
      <InputGroupAddon align="inline-end">
        <button
          className="cursor-pointer text-muted-foreground hover:text-foreground"
          onClick={() => setShow((s) => !s)}
          type="button"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </InputGroupAddon>
    </InputGroup>
  );
}
