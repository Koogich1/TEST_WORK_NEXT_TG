"use client";

import { UserBlock } from "@/widgets/user-block/user-block";
import { FundCard } from "@/widgets/fund-card/fund-card";
import { LeaderboardTabs } from "@/widgets/leaderboard-tabs/leaderboard-tabs";
import { BottomNav } from "@/widgets/bottom-nav/bottom-nav";

export default function Home() {
  return (
    <div className="flex min-h-screen w-full min-w-[320px] max-w-[475px] flex-col mx-auto bg-background sm:border-x sm:border-border/30">
      <main className="min-w-0 flex-1 overflow-auto pb-20">
        <UserBlock />
        <div className="px-4 pb-4">
          <FundCard />
        </div>
        <div className="min-w-0 pt-2 pb-4">
          <LeaderboardTabs />
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
