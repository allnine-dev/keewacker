import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import KeewackerShell from "@/components/KeewackerShell";
import TvRemoteHints from "@/components/TvRemoteHints";
import { Providers } from "@/components/Providers";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

const inter = Inter({ subsets: ["latin"] });

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Keewacker";

export const metadata: Metadata = {
  title: `${APP_NAME} - Cinema Streaming Platform`,
  description: "Your premium cinema streaming experience",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_NAME,
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#f5c400",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body className={inter.className}>
        <Providers>
          <KeewackerShell>{children}</KeewackerShell>
          <TvRemoteHints />
        </Providers>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
