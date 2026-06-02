import { orpc } from "@/orpc/client";
import { getQueryClient, HydrateClient } from "@/orpc/query/hydration";
import "@/orpc/server";
import PageClient from "./page.client";

export default async function SettingsServerPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    orpc.config.getSetup.queryOptions({ input: undefined })
  );

  return (
    <HydrateClient client={queryClient}>
      <PageClient />
    </HydrateClient>
  );
}
