"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Alert } from "@/components/Alert";
import { apiClient } from "@/lib/api";

interface OrderItem {
  sku: string;
  quantity: number;
  color?: string;
  name: string;
  price: number;
}

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const itemsParam = searchParams.get("items");
      if (itemsParam) {
        setItems(JSON.parse(decodeURIComponent(itemsParam)));
      }
    } catch (err) {
      setError("Error al cargar los productos");
    }
  }, [searchParams]);

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirmOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const order = await apiClient.createOrder({
        buyList: items.map((item) => ({
          sku: item.sku,
          quantity: item.quantity,
          color: item.color,
        })),
      });

      setOrderCode(order.code);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error creando el pedido";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (orderCode) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <header className="bg-white border-b border-border shadow-sm">
          <div className="flex items-center justify-between p-4 max-w-2xl mx-auto w-full">
            <h1 className="text-xl font-bold text-text">Store QR</h1>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-2xl mx-auto w-full flex flex-col items-center justify-center">
          <Card className="space-y-6 text-center">
            <div className="space-y-2">
              <div className="text-6xl font-bold text-success">✓</div>
              <h2 className="text-3xl font-bold text-text">¡Pedido Creado!</h2>
            </div>

            <div className="bg-primary-light rounded-lg p-4 space-y-2">
              <p className="text-sm text-text-muted">Tu código de orden es:</p>
              <p className="text-4xl font-bold text-primary font-mono">{orderCode}</p>
            </div>

            <div className="bg-secondary rounded-lg p-4 space-y-2">
              <p className="text-sm text-text-muted">Cantidad de productos:</p>
              <p className="text-2xl font-bold text-text">{items.length}</p>
            </div>

            <div className="bg-secondary rounded-lg p-4 space-y-2">
              <p className="text-sm text-text-muted">Total:</p>
              <p className="text-2xl font-bold text-text">
                ${totalPrice.toFixed(2)}
              </p>
            </div>

            <div className="bg-warning bg-opacity-10 border border-warning rounded-lg p-4 space-y-1">
              <p className="text-sm font-semibold text-text">Próximo paso:</p>
              <p className="text-text-muted">
                Presenta este código en caja para completar tu compra
              </p>
            </div>

            <div className="pt-4 space-y-2">
              <Button
                fullWidth
                onClick={() => router.push("/customer")}
                variant="secondary"
              >
                Continuar Comprando
              </Button>
              <Button
                fullWidth
                onClick={() => router.push("/")}
                variant="ghost"
              >
                Ir al Inicio
              </Button>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="section-title">Resumen de tu Pedido</h2>

        {error && (
          <Alert
            type="error"
            title="Error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {items.length === 0 ? (
          <Alert type="info" message="No hay productos en tu pedido" />
        ) : (
          <>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-start p-3 bg-secondary rounded-md"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-text">{item.name}</p>
                    {item.color && (
                      <p className="text-xs text-text-muted">Color: {item.color}</p>
                    )}
                    <p className="text-sm text-text-muted">
                      Cantidad: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-xs text-text-muted">
                      ${item.price.toFixed(2)} c/u
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-text-muted">Subtotal:</span>
                <span className="font-semibold text-text">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <div className="bg-primary-light rounded-md p-3 flex justify-between items-center">
                <span className="font-semibold text-text">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="bg-primary-light rounded-lg p-4">
              <p className="text-sm text-text-muted mb-2">
                Al confirmar tu pedido:
              </p>
              <ul className="text-sm space-y-1 text-text-muted">
                <li>✓ Recibirás un código único</li>
                <li>✓ Preséntalo en caja para completar</li>
                <li>✓ Los precios pueden variar según promociones</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                fullWidth
                variant="secondary"
                onClick={() => router.back()}
              >
                Volver
              </Button>
              <Button
                fullWidth
                onClick={handleConfirmOrder}
                loading={loading}
              >
                Confirmar Pedido
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-4">Cargando...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
