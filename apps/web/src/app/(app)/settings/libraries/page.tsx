import { orpc } from "@/orpc/client";
import { getQueryClient, HydrateClient } from "@/orpc/query/hydration";
import "@/orpc/server";
import PageClient from "./page.client";

export default async function SettingsLibrariesPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(
    orpc.library.list.queryOptions({ input: undefined, retry: false })
  );

  return (
    <HydrateClient client={queryClient}>
      <PageClient />
    </HydrateClient>
  );
}
