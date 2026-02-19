"use client";

import Link from "next/link";

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="bg-white border-b border-border shadow-md sticky top-0 z-40">
        <div className="flex items-center justify-between p-4 px-6">
          <div>
            <h1 className="text-2xl font-bold text-text">Store QR</h1>
            <p className="text-xs text-text-muted">Panel de Caja</p>
          </div>
          <Link href="/" className="text-primary hover:text-primary-dark text-sm">
            Salir
          </Link>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">{children}</main>
    </div>
  );
}
