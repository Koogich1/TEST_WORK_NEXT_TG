import { API_BASE_URL } from "@/shared/config/env";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `API error ${res.status} ${res.statusText}: ${url}\n${text.slice(0, 200)}`
    );
  }
  return res.json() as Promise<T>;
}

export const api = {
  getFundStats: () => request<FundStatsResponse>("/api/fund/stats"),
  getTransactionHistory: (limit?: number) =>
    request<TransactionHistoryItem[]>(
      limit ? `/api/transaction-history?limit=${limit}` : "/api/transaction-history"
    ),
  createTransaction: (data: CreateTransactionRequest) =>
    request<TransactionResponse>("/api/transactions", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};

export interface FundStatsResponse {
  id: string;
  totalRaised: number;
  goal: number;
  progress: number;
  membersCount: number;
  purchasedCount: number;
  wallet: { tonToPointsRate: number };
}

export interface TransactionHistoryItem {
  id: string;
  userId: string;
  amount: string;
  currency: string;
  metadata: string;
  createdAt: string;
  user: {
    tgId: string;
    username: string | null;
    firstName: string | null;
    lastName: string | null;
    photoUrl: string | null;
    points: number;
  };
}

export interface CreateTransactionRequest {
  amount: number;
  currency: string;
}

export interface TransactionResponse {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}
