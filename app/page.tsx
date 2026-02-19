"use client";

import Link from "next/link";
import { Button } from "@/components/Button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-bg">
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-text">Store QR</h1>
            <p className="text-lg text-text-muted">
              Sistema de Autogestión de Pedidos
            </p>
          </div>

          <div className="bg-primary-light rounded-lg p-6 space-y-4">
            <p className="text-text font-medium">
              Arma tu pedido mientras recorres el local
            </p>
            <p className="text-sm text-text-muted">
              Ingresa el código del producto (SKU) de la góndola y crea tu
              lista. Sin descarga de app, solo con tu celular.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Link href="/customer" className="block">
              <Button fullWidth size="lg">
                Comenzar a Comprar
              </Button>
            </Link>

            <Link href="/cashier/login" className="block">
              <Button variant="secondary" fullWidth size="lg">
                Panel de Caja
              </Button>
            </Link>
          </div>

          <div className="text-xs text-text-muted pt-6 border-t border-border">
            <p>Una nueva forma de comprar dentro del comercio</p>
          </div>
        </div>
      </div>
    </div>
  );
}
