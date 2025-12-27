"use client";

import Link from "next/link";
import { ReactNode } from "react";
import SearchBar from "./SearchBar";

interface KeewackerShellProps {
  children: ReactNode;
}

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Keewacker";

export default function KeewackerShell({ children }: KeewackerShellProps) {
  return (
    <div className="min-h-screen bg-cinema-bg">
      {/* Header */}
      <header className="bg-cinema-surface border-b border-cinema-border sticky top-0 z-40 backdrop-blur-lg bg-cinema-surface/95">
        <nav className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-2xl md:text-3xl font-bold text-cinema-accent tv-focus rounded-lg px-4 py-2 flex-shrink-0"
            >
              {APP_NAME}
            </Link>

            {/* Search Bar - Center */}
            <div className="flex-1 max-w-xl hidden md:block">
              <SearchBar />
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/trending">Trending</NavLink>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mt-4 md:hidden">
            <SearchBar />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-cinema-surface border-t border-cinema-border mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-cinema-muted">
          <p className="text-lg">
            {APP_NAME} - Your cinema streaming platform
          </p>
          <p className="text-sm mt-2">
            Made with TMDB and piapig by allnine
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <span className="text-sm">Powered by</span>
            <span className="text-cinema-accent font-semibold">allnine innovations</span>
            <a
              href="https://github.com/allnine-dev/keewacker"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-cinema-muted hover:text-cinema-accent transition-colors"
              aria-label="GitHub Repository"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="text-cinema-text hover:text-cinema-accent text-base md:text-lg font-medium tv-focus rounded-lg px-3 md:px-4 py-2 transition-colors"
    >
      {children}
    </Link>
  );
}
