import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import KeewackerShell from "@/components/KeewackerShell";
import TvRemoteHints from "@/components/TvRemoteHints";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Keewacker";

export const metadata: Metadata = {
  title: `${APP_NAME} - Cinema Streaming Platform`,
  description: "Your premium cinema streaming experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <KeewackerShell>{children}</KeewackerShell>
        <TvRemoteHints />
      </body>
    </html>
  );
}
