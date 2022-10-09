// src/server/router/index.ts
import { t } from "../trpc";

import { exampleRouter } from "./example";
import { dataRouter } from "./data";

export const appRouter = t.router({
  example: exampleRouter,
  data: dataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
