import { createEffect, createStore, sample } from "effector";
import type { TransactionHistoryItem } from "@/shared/api/client";
import { api } from "@/shared/api/client";

export const loadTransactionsFx = createEffect(async () => {
  return api.getTransactionHistory(100);
});

export const $transactions = createStore<TransactionHistoryItem[]>([])
  .on(loadTransactionsFx.doneData, (_, data) => data)
  .reset(loadTransactionsFx.fail);

export const $transactionsLoading = createStore(false)
  .on(loadTransactionsFx.pending, (_, pending) => pending)
  .on(loadTransactionsFx.done, () => false)
  .on(loadTransactionsFx.fail, () => false);

export const $transactionsError = createStore<Error | null>(null)
  .on(loadTransactionsFx.fail, (_, { error }) => error)
  .on(loadTransactionsFx.done, () => null);

sample({
  clock: loadTransactionsFx.fail,
  timeout: 5000,
  target: loadTransactionsFx,
});
