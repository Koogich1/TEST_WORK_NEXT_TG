import { createEvent, createStore, createEffect, sample } from "effector";
import { api } from "@/shared/api/client";

export const MIN_POINTS = 100;

export const setAmount = createEvent<number>();
export const setCurrency = createEvent<string>();
export const setExpirationValue = createEvent<string>();
export const submitBuy = createEvent<{ amount: number; currency: string }>();
export const resetBuyForm = createEvent();

export const $amount = createStore(100)
  .on(setAmount, (_, v) => v)
  .reset(resetBuyForm);
export const $currency = createStore("TON")
  .on(setCurrency, (_, v) => v)
  .reset(resetBuyForm);
export const $expirationValue = createStore("")
  .on(setExpirationValue, (_, v) => v)
  .reset(resetBuyForm);

export const $amountError = createStore<string | null>(null)
  .on(setAmount, (_, amount) =>
    amount < MIN_POINTS ? `You must buy at least ${MIN_POINTS} points` : null
  )
  .reset(resetBuyForm);

export const $canSubmit = $amount.map((amount) => amount >= MIN_POINTS);

export const submitBuyFx = createEffect(
  async ({ amount, currency }: { amount: number; currency: string }) => {
    return api.createTransaction({ amount, currency });
  }
);

export const $submitError = createStore<Error | null>(null)
  .on(submitBuyFx.fail, (_, { error }) => error)
  .reset(resetBuyForm);

export const $isSubmitting = createStore(false)
  .on(submitBuyFx, () => true)
  .on(submitBuyFx.done, () => false)
  .on(submitBuyFx.fail, () => false);

sample({
  clock: submitBuy,
  source: { amount: $amount, currency: $currency },
  filter: ({ amount }) => amount >= MIN_POINTS,
  fn: ({ amount, currency }) => ({ amount, currency }),
  target: submitBuyFx,
});
