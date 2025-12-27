"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/lib/auth";
import { WatchlistProvider } from "@/lib/watchlist";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <WatchlistProvider>
        {children}
      </WatchlistProvider>
    </AuthProvider>
  );
}
