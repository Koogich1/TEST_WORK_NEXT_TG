"use client";

import { useUnit } from "effector-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  $amount,
  $amountError,
  $canSubmit,
  $currency,
  $expirationValue,
  MIN_POINTS,
  resetBuyForm,
  setAmount,
  setCurrency,
  setExpirationValue,
} from "@/features/buy/model";
import { cn } from "@/lib/utils";
import { FaChevronDown, FaMinus, FaPlus } from "react-icons/fa";

const CURRENCIES = ["TON", "ETH", "USDT", "BTC"] as const;

export default function BuyPage() {
  const router = useRouter();
  const amount = useUnit($amount);
  const amountError = useUnit($amountError);
  const canSubmit = useUnit($canSubmit);
  const expirationValue = useUnit($expirationValue);
  const currency = useUnit($currency);
  const setAmountFn = useUnit(setAmount);
  const setCurrencyFn = useUnit(setCurrency);
  const setExpirationFn = useUnit(setExpirationValue);

  useEffect(() => {
    return () => resetBuyForm();
  }, []);

  const handleBuyClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    router.push("/");
  };

  return (
    <main className="min-h-screen w-full px-7 bg-[#29292E] flex items-center justify-center">
      <form onSubmit={handleBuyClick} className="flex flex-1 flex-col items-center gap-6">
        <div className="w-full max-w-sm space-y-2">
          <div className="flex items-center justify-between gap-2 rounded-xl bg-[#212124] px-4 py-3">
            <Button
              type="button"
              onClick={() => setAmountFn(Math.max(0, amount - 1))}
              className="flex p-1 h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#aab8c2] text-[#151f2b] transition-transform hover:scale-105 active:scale-95"
            >
              <FaMinus />
            </Button>
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step={1}
              value={amount || ""}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "") {
                  setAmountFn(0);
                  return;
                }
                const n = parseFloat(v);
                if (!Number.isNaN(n) && n >= 0) setAmountFn(n);
              }}
              className="min-w-0 flex-1 bg-transparent text-center text-lg font-semibold tabular-nums text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <Button
              type="button"
              onClick={() => setAmountFn(amount + 1)}
              className="flex p-1 h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#aab8c2] text-[#151f2b] transition-transform hover:scale-105 active:scale-95"
            >
              <FaPlus />
            </Button>
          </div>
          <p
            className={cn(
              "text-center text-sm",
              amountError ? "text-amber-400" : "text-[#B0B0B0]"
            )}
          >
            {amountError ?? `You must buy at least ${MIN_POINTS} points`}
          </p>
        </div>
        <span className="block text-start w-full text-sm text-[#B0B0B0]">
          Set expiration date and time
        </span>
        <div className="w-full max-w-sm space-y-2">
          <div className="flex w-full overflow-hidden rounded-lg gap-3 text">
            <div className="w-[100px] shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex h-14 w-[100px] items-center justify-center gap-1.5 border-0 bg-[#1E2227] px-3 text-lg text-[#A8ACB2] outline-none focus:ring-2 focus:ring-[#2F91EA]/50 focus:ring-inset rounded-lg">
                  <span>{currency}</span>
                  <FaChevronDown className="h-3.5 w-3.5 shrink-0 text-[#A8ACB2]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="min-w-[var(--anchor-width)] rounded-xl border-0 bg-[#1E2227] p-1 text-[#A8ACB2] shadow-lg ring-1 ring-white/10"
                >
                  {CURRENCIES.map((c) => (
                    <DropdownMenuItem
                      key={c}
                      onClick={() => setCurrencyFn(c)}
                      className="rounded-lg text-[#A8ACB2] focus:bg-[#29292E] focus:text-[#A8ACB2] data-[focus]:bg-[#29292E] data-[focus]:text-[#A8ACB2]"
                    >
                      {c}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Input
              type="text"
              placeholder="200.7500"
              value={expirationValue}
              onChange={(e) => setExpirationFn(e.target.value)}
              className="h-14 min-w-0 flex-[2] border-0 bg-[#1E2227]! px-5 text-lg tabular-nums text-[#A8ACB2] placeholder:text-[#A8ACB2]/70"
            />
          </div>
        </div>

        <div className="mt-auto w-full max-w-sm pt-4">
          <Button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-xl py-6 text-base font-medium text-white transition-transform hover:opacity-90 active:scale-[0.99] bg-[#2F91EA] focus-visible:ring-2 focus-visible:ring-[#2F91EA]/50"
          >
            Buy
          </Button>
        </div>
      </form>
    </main>
  );
}
