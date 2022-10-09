import { t } from "../trpc";
import { z } from "zod";
import { getDataService } from "../../../services";

export const dataRouter = t.router({
  hello: t.procedure.query(({ input }) => {
    return getDataService();
  }),
});
