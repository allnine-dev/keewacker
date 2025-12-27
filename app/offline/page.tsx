"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-cinema-bg flex flex-col items-center justify-center text-center px-4">
      <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"
          />
        </svg>
      </div>
      <h1 className="text-3xl font-bold text-white mb-3">You&apos;re Offline</h1>
      <p className="text-zinc-400 max-w-md mb-6">
        It looks like you&apos;ve lost your internet connection. Please check your
        connection and try again.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-[#f5c400] hover:bg-[#f5c400]/90 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Try Again
      </button>
    </div>
  );
}
