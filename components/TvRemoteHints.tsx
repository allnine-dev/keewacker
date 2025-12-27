"use client";

import { useEffect, useState } from "react";

export default function TvRemoteHints() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show hints on first visit or when pressing ? key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" || e.key === "h" || e.key === "H") {
        setVisible((v) => !v);
      }
      if (e.key === "Escape") {
        setVisible(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-4 right-4 bg-cinema-surface/90 backdrop-blur text-cinema-muted hover:text-cinema-accent px-4 py-2 rounded-lg text-sm tv-focus z-50"
        aria-label="Show remote control hints"
      >
        Press ? for help
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-8">
      <div className="bg-cinema-surface border-2 border-cinema-border rounded-2xl p-8 max-w-2xl w-full">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-cinema-accent">
            Remote Control Guide
          </h2>
          <button
            onClick={() => setVisible(false)}
            className="text-cinema-muted hover:text-cinema-text text-2xl tv-button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6 text-lg">
          <div className="grid grid-cols-2 gap-4">
            <HintItem icon="↑ ↓" label="Navigate sections" />
            <HintItem icon="← →" label="Navigate items" />
            <HintItem icon="Enter" label="Select / Play" />
            <HintItem icon="Backspace" label="Go back" />
            <HintItem icon="Escape" label="Close dialogs" />
            <HintItem icon="?" label="Show this help" />
          </div>

          <div className="mt-8 pt-6 border-t border-cinema-border">
            <p className="text-cinema-muted text-base">
              Yellow focus rings indicate the active element.
              <br />
              All controls are accessible via remote/keyboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function HintItem({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-4 bg-cinema-card p-4 rounded-lg">
      <div className="bg-cinema-bg px-4 py-2 rounded font-mono text-cinema-accent text-xl font-bold min-w-[80px] text-center">
        {icon}
      </div>
      <div className="text-cinema-text">{label}</div>
    </div>
  );
}
