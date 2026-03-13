"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTmaUser } from "@/shared/lib/tma";

const DESCRIPTION =
  "Create sustained impact. Support verified projects. Get regular updates. Save tax. Use web3.";

export function UserBlock({ className }: { className?: string }) {
  const tmaUser = useTmaUser();

  const username =
    tmaUser?.username ||
    [tmaUser?.firstName, tmaUser?.lastName].filter(Boolean).join(" ") ||
    "Username";

  const avatar = tmaUser?.photoUrl ?? null;

  const rank = 2932;
  const points = 26031;

  return (
    <section
      className={cn("animate-in-fade-up flex flex-col gap-3 px-4 py-3", className)}
    >
      <div className="flex items-start gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-violet-600 to-blue-600 ring-2 ring-primary/20">
          {avatar ? (
            <Image
              src={avatar}
              alt=""
              className="h-full w-full object-cover"
              width={48}
              height={48}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium text-foreground">{username}</p>
          <p className="text-xs text-muted-foreground">
            Your rank #{rank.toLocaleString()}
          </p>
        </div>
        <div className="rounded-xl relative border border-[#8a8f95]/20 px-6 py-[6px] text-right">
          <p className="text-sm font-semibold text-foreground">
            {points.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground absolute left-4 bg-[#2e2e33] px-3 rounded-full">
            Points
          </p>
        </div>
      </div>
      <div className="space-y-2 pt-2">
        <p className={cn("text-sm text-muted-foreground transition-all duration-300")}>
          {DESCRIPTION}
        </p>
        <Button
          variant="secondary"
          size="lg"
          className="w-full rounded-xl transition-transform active:scale-[0.98]"
        >
          Read More
        </Button>
      </div>
    </section>
  );
}
