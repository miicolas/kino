import { getQueryClient, HydrateClient } from "@/orpc/query/hydration";
import "@/orpc/server";
import MarketingPageClient from "./page.client";

export default async function MarketingPage() {
  const queryClient = getQueryClient();

  // prefetchQuery calls go here when the API is ready:
  // await queryClient.prefetchQuery({
  //   queryKey: ["resource"],
  //   queryFn: () => api.v1.resource.get().then((r) => r.data),
  // });

  return (
    <HydrateClient client={queryClient}>
      <MarketingPageClient />
    </HydrateClient>
  );
}
