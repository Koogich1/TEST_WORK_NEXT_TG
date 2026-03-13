import { createEffect, createStore, sample } from "effector";
import { api, type FundStatsResponse } from "@/shared/api/client";

export const loadFundStatsFx = createEffect(async () => {
  return api.getFundStats();
});

export const $fundStats = createStore<FundStatsResponse | null>(null)
  .on(loadFundStatsFx.doneData, (_, data) => data)
  .reset(loadFundStatsFx.fail);

export const $fundLoading = createStore(false)
  .on(loadFundStatsFx.pending, (_, pending) => pending)
  .on(loadFundStatsFx.done, () => false)
  .on(loadFundStatsFx.fail, () => false);

export const $fundError = createStore<Error | null>(null)
  .on(loadFundStatsFx.fail, (_, { error }) => error)
  .on(loadFundStatsFx.done, () => null);

sample({
  clock: loadFundStatsFx.fail,
  timeout: 5000,
  target: loadFundStatsFx,
});
