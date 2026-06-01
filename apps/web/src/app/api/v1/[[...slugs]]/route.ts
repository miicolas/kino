import { Elysia } from 'elysia';
import { router } from "~/server";

export const app = new Elysia({ name: "app", prefix: "/api" })
  .get('/', () => ({ message: "Kino API" }))
  .use(router)

const handle = (req: Request) => app.handle(req)

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
export const PATCH = handle;
