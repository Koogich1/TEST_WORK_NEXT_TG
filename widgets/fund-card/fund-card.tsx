"use client";

import { useUnit } from "effector-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  $fundStats,
  $fundLoading,
  $fundError,
  loadFundStatsFx,
} from "@/entities/fund/model";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

function formatTon(n: number) {
  return (
    n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }) + " TON"
  );
}

export function FundCard({ className }: { className?: string }) {
  const router = useRouter();
  const stats = useUnit($fundStats);
  const loading = useUnit($fundLoading);
  const error = useUnit($fundError);

  useEffect(() => {
    loadFundStatsFx();
  }, []);

  const totalRaised = stats?.totalRaised ?? 0;
  const goal = stats?.goal ?? 1000;
  const progress = stats?.progress ?? 0;
  const membersCount = stats?.membersCount ?? 0;
  const purchasedCount = stats?.purchasedCount ?? 0;
  const tonToPointsRate = stats?.wallet?.tonToPointsRate ?? 0.01;
  const pricePerPoint = 1 / (tonToPointsRate || 1);

  const handleGetDropPoints = () => {
    router.push("/buy");
  };

  return (
    <Card
      className={cn(
        "animate-in-fade-up border-border/50 bg-[#2e2e33] backdrop-blur-sm mt-2",
        className
      )}
    >
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">◆</span>
          <span className="text-sm text-muted-foreground">
            Total funds raised {formatTon(totalRaised)}
          </span>
        </div>
        <div className="space-y-1">
          <div className="relative h-7 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[13px] font-medium text-muted-foreground pointer-events-none">
              {progress.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs pt-3 text-muted-foreground">
            First round goal {formatTon(goal)}
          </p>
        </div>
        <div className="bg-[#253341] rounded-lg p-3">
          <div className="flex flex-wrap items-center bg-[#253341] justify-between gap-3 rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                dp
              </div>
              <div>
                <p className="text-xs text-muted-foreground ">Drop Points price:</p>
                <p className="font-semibold text-foreground/80">
                  {pricePerPoint.toFixed(2)} TON
                </p>
              </div>
            </div>
            <Link href="/buy" className="shrink-0">
              <Button
                variant="secondary"
                size="sm"
                className="rounded-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Buy
              </Button>
            </Link>
          </div>
          <p className="flex items-center gap-1 text-xs pt-3 text-muted-foreground">
            🔥
            {error
              ? "Error loading stats"
              : loading
                ? "Updating..."
                : `${(membersCount / 1000).toFixed(2)}K members & ${purchasedCount.toFixed(2)} purchased`}
          </p>
        </div>
        <Button
          onClick={handleGetDropPoints}
          className="w-full rounded-lg text-primary-foreground transition-transform hover:scale-[1.01] active:scale-[0.99] text-white"
          size="lg"
        >
          Get drop points!
        </Button>
      </CardContent>
    </Card>
  );
}
