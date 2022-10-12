import { t } from "../trpc";
import { getDataService } from "../../../services";

export const dataRouter = t.router({
  hello: t.procedure.query(({ }) => {
    return getDataService();
  }),
});
