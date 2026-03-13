"use client";

import { cn } from "@/lib/utils";
import { FaPiggyBank } from "react-icons/fa";
import { FiZap, FiCircle, FiMenu } from "react-icons/fi";
import { HiOutlineUserGroup } from "react-icons/hi";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { icon: FaPiggyBank, label: "Piggy", href: "/piggy" },
  { icon: FiZap, label: "Ideas", href: "/ideas" },
  { icon: FiCircle, label: "Circle", href: "/circle" },
  { icon: HiOutlineUserGroup, label: "Users", href: "/users" },
  { icon: FiMenu, label: "Menu", href: "/menu" },
] as const;

export function BottomNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/10 py-2",
        "max-w-[475px] mx-auto",
        className
      )}
      style={{ backgroundColor: "var(--nav-background, #151f2b)" }}
    >
      {ITEMS.map(({ icon: Icon, label, href }) => {
        const isActive = (href === "/piggy" && isHomePage) || pathname === href;

        return (
          <Link key={label} href={href} className="flex items-center justify-center">
            <button
              type="button"
              aria-label={label}
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-95",
                isActive
                  ? "text-foreground bg-white/10"
                  : "text-foreground/80 hover:text-foreground"
              )}
            >
              <Icon className="text-xl" aria-hidden />
            </button>
          </Link>
        );
      })}
    </nav>
  );
}
