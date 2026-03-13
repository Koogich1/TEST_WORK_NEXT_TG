"use client";

import { useUnit } from "effector-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  $transactions,
  $transactionsLoading,
  loadTransactionsFx,
} from "@/entities/transactions/model";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import type { TransactionHistoryItem } from "@/shared/api/client";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const TAB_IDS = ["holders", "transfers", "top"] as const;
const SWIPE_THRESHOLD = 60;

function formatTon(amount: string | number) {
  const n = typeof amount === "string" ? parseFloat(amount) : amount;
  return n.toFixed(2) + " TON";
}

function LeaderboardRow({
  item,
  rank,
  className,
}: {
  item: TransactionHistoryItem;
  rank: number;
  className?: string;
}) {
  const displayName =
    item.user?.username ||
    [item.user?.firstName, item.user?.lastName].filter(Boolean).join(" ") ||
    "User";
  return (
    <div
      className={cn(
        "animate-in-fade-up flex items-center gap-3 rounded-lg bg-muted/40 px-3 py-2 transition-colors hover:bg-muted/60",
        className
      )}
      style={{ animationDelay: `${rank * 30}ms` }}
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-violet-500/50 to-blue-500/50">
        {item.user?.photoUrl ? (
          <Image
            src={item.user.photoUrl}
            alt={displayName}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm font-medium text-foreground">
            {displayName.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
        <p className="text-xs text-muted-foreground">{formatTon(item.amount)}</p>
      </div>
      <span className="text-sm font-medium text-foreground">#{rank}</span>
    </div>
  );
}

export function LeaderboardTabs({ className }: { className?: string }) {
  const transactions = useUnit($transactions);
  const loading = useUnit($transactionsLoading);
  const [activeTab, setActiveTab] = useState<(typeof TAB_IDS)[number]>("holders");
  const touchStartX = useRef(0);

  useEffect(() => {
    loadTransactionsFx();
  }, []);

  const list = transactions ?? [];

  const tabData = useMemo(() => {
    switch (activeTab) {
      case "holders":
        return [...list].sort((a, b) => (b.user?.points ?? 0) - (a.user?.points ?? 0));
      case "transfers":
        return [...list].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "top":
        return [...list].sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
      default:
        return list;
    }
  }, [list, activeTab]);

  const onSwipeStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  }, []);

  const onSwipeEnd = useCallback(
    (e: React.TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const delta = endX - touchStartX.current;
      const currentIndex = TAB_IDS.indexOf(activeTab);
      if (delta < -SWIPE_THRESHOLD && currentIndex < TAB_IDS.length - 1) {
        setActiveTab(TAB_IDS[currentIndex + 1]);
      } else if (delta > SWIPE_THRESHOLD && currentIndex > 0) {
        setActiveTab(TAB_IDS[currentIndex - 1]);
      }
    },
    [activeTab]
  );

  const tabButtonClass = (id: (typeof TAB_IDS)[number]) =>
    cn(
      "min-h-[30px] shrink-0 rounded-md py-4 px-4 text-[14px] rounded-xl font-medium whitespace-nowrap flex items-center justify-center transition-colors text-[#f5f8fa]",
      activeTab === id ? "bg-[#f5f8fa] text-[#1a1a1a]" : "bg-[#37373c] hover:bg-[#2d2d32]"
    );

  return (
    <div className={cn("animate-in-fade px-4 min-w-0 w-full overflow-hidden", className)}>
      <div
        className="flex w-full min-w-0 gap-1 overflow-x-auto overflow-y-hidden touch-pan-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
        role="tablist"
      >
        <Button
          role="tab"
          aria-selected={activeTab === "holders"}
          className={tabButtonClass("holders")}
          onClick={() => setActiveTab("holders")}
        >
          Holders leaderboard
        </Button>
        <Button
          role="tab"
          aria-selected={activeTab === "transfers"}
          className={tabButtonClass("transfers")}
          onClick={() => setActiveTab("transfers")}
        >
          Latest transfers
        </Button>
        <Button
          role="tab"
          aria-selected={activeTab === "top"}
          className={tabButtonClass("top")}
          onClick={() => setActiveTab("top")}
        >
          TOP users
        </Button>
      </div>
      <div
        className="mt-3 touch-pan-y"
        onTouchStart={onSwipeStart}
        onTouchEnd={onSwipeEnd}
      >
        <Tabs value={activeTab} className="w-full">
          <TabsContent value="holders" className="mt-0 outline-none">
            <ScrollList list={tabData} loading={loading} />
          </TabsContent>
          <TabsContent value="transfers" className="mt-0 outline-none">
            <ScrollList list={tabData} loading={loading} />
          </TabsContent>
          <TabsContent value="top" className="mt-0 outline-none">
            <ScrollList list={tabData} loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function ScrollList({
  list,
  loading,
}: {
  list: TransactionHistoryItem[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-in-fade-up h-16 rounded-lg bg-muted/20"
            style={{ animationDelay: `${i * 50}ms` }}
          />
        ))}
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-muted-foreground animate-in-fade">
        No data yet
      </div>
    );
  }

  return (
    <div className="max-h-[280px] overflow-y-auto overscroll-contain scroll-smooth rounded-lg pr-1 [scrollbar-gutter:stable]">
      <ul className="space-y-2">
        {list.map((item, i) => (
          <li key={item.id}>
            <LeaderboardRow item={item} rank={i + 1} />
          </li>
        ))}
      </ul>
    </div>
  );
}
