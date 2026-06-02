import {
  dehydrate,
  HydrationBoundary,
  type QueryClient,
} from "@tanstack/react-query";
import { cache } from "react";
import { createQueryClient } from "./client";

export const getQueryClient = cache(createQueryClient);

export function HydrateClient({
  client,
  children,
}: {
  client: QueryClient;
  children: React.ReactNode;
}) {
  return (
    <HydrationBoundary state={dehydrate(client)}>{children}</HydrationBoundary>
  );
}
