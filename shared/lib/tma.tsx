"use client";

import { type ReactNode, useEffect, useState, createContext, useContext } from "react";
import { init, initData } from "@tma.js/sdk";

export interface TmaUser {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
}

function parseTmaUser(raw: Record<string, unknown>): TmaUser | null {
  const id = raw.id as number | undefined;
  if (!id) return null;
  return {
    id,
    username: (raw.username as string) ?? undefined,
    firstName: (raw.first_name ?? raw.firstName) as string | undefined,
    lastName: (raw.last_name ?? raw.lastName) as string | undefined,
    photoUrl: (raw.photo_url ?? raw.photoUrl) as string | undefined,
  };
}

let sdkInitialized = false;

function initSdk() {
  if (sdkInitialized) return;
  try {
    init();
    sdkInitialized = true;
  } catch {}
  try {
    initData.restore();
  } catch {}
}

function getSdkUser(): TmaUser | null {
  try {
    const tgUser = initData.user();
    if (!tgUser) return null;
    return parseTmaUser(tgUser as unknown as Record<string, unknown>);
  } catch {
    return null;
  }
}

function getLegacyUser(): TmaUser | null {
  try {
    const w = window as unknown as {
      Telegram?: { WebApp?: { initDataUnsafe?: { user?: unknown } } };
    };
    const u = w.Telegram?.WebApp?.initDataUnsafe?.user;
    if (!u) return null;
    return parseTmaUser(u as Record<string, unknown>);
  } catch {
    return null;
  }
}

function getUserFromHash(): TmaUser | null {
  try {
    const hash = window.location.hash.slice(1);
    if (!hash) return null;
    const params = new URLSearchParams(hash);
    let userStr = params.get("user");
    if (!userStr) {
      const tgData = params.get("tgWebAppData");
      if (tgData) {
        userStr = new URLSearchParams(tgData).get("user");
      }
    }
    if (!userStr) return null;
    return parseTmaUser(JSON.parse(decodeURIComponent(userStr)));
  } catch {
    return null;
  }
}

function resolveUser(): TmaUser | null {
  return getSdkUser() ?? getLegacyUser() ?? getUserFromHash();
}

const TmaUserContext = createContext<TmaUser | null>(null);

export function TmaProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TmaUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    initSdk();

    const found = resolveUser();
    if (found) {
      setUser(found);
      return;
    }

    let unsub: (() => void) | undefined;
    const retry = () => {
      const u = resolveUser();
      if (u) {
        setUser(u);
        unsub?.();
      }
    };

    try {
      unsub = initData.on("changed", retry);
    } catch {}

    const t1 = setTimeout(retry, 150);
    const t2 = setTimeout(retry, 600);
    const t3 = setTimeout(retry, 1500);

    return () => {
      unsub?.();
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, []);

  return <TmaUserContext.Provider value={user}>{children}</TmaUserContext.Provider>;
}

export function useTmaUser(): TmaUser | null {
  return useContext(TmaUserContext);
}
