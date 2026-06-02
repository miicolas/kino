import type { SearchParams } from "nuqs/server";
import { orpc } from "@/orpc/client";
import { getQueryClient, HydrateClient } from "@/orpc/query/hydration";
import { api } from "@/orpc/server";
import PageClient from "./page.client";
import { SETUP_STEPS, setupSearchParamsCache } from "./search-params";

export default async function SetupPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  setupSearchParamsCache.parse(params);

  const queryClient = getQueryClient();

  const [initialConfig] = await Promise.all([
    api.config.getSetup(),
    queryClient.prefetchQuery(
      orpc.library.list.queryOptions({ input: undefined, retry: false })
    ),
  ]);

  const hasValidRequestedStep =
    typeof params.step === "string" &&
    SETUP_STEPS.includes(params.step as (typeof SETUP_STEPS)[number]);

  return (
    <HydrateClient client={queryClient}>
      <PageClient
        hasValidRequestedStep={hasValidRequestedStep}
        initialConfig={initialConfig}
      />
    </HydrateClient>
  );
}
