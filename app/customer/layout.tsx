"use client";

import Link from "next/link";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold text-text">Store QR</h1>
          <Link href="/" className="text-primary hover:text-primary-dark text-sm">
            Inicio
          </Link>
        </div>
      </header>
      <main className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
