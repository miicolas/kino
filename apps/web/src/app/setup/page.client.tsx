"use client";

import { SetupStepper } from "./_components/setup-stepper";
import type { SetupConfig } from "./_components/setup-types";

export default function PageClient({
  hasValidRequestedStep,
  initialConfig,
}: {
  hasValidRequestedStep: boolean;
  initialConfig: SetupConfig;
}) {
  return (
    <SetupStepper
      hasValidRequestedStep={hasValidRequestedStep}
      initialConfig={initialConfig}
    />
  );
}
