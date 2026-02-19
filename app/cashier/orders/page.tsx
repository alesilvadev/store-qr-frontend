"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Alert } from "@/components/Alert";
import { useOrder } from "@/lib/hooks";

export default function OrdersPage() {
  const router = useRouter();
  const [orderCode, setOrderCode] = useState("");
  const { order, loading, error, fetchOrderByCode } = useOrder();
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderCode.trim()) return;

    try {
      await fetchOrderByCode(orderCode.trim());
      setSearched(true);
    } catch {
      setSearched(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="section-title">Búsqueda de Pedidos</h2>
          <p className="text-text-muted text-sm mt-1">
            Ingresa el código del pedido del cliente
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      <Card className="space-y-4">
        <form onSubmit={handleSearch} className="space-y-3">
          <Input
            label="Código de Pedido"
            placeholder="Ej: ABC123XYZ"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
            disabled={loading}
            autoFocus
          />
          <Button fullWidth loading={loading} size="lg">
            Buscar Pedido
          </Button>
        </form>

        {error && searched && (
          <Alert
            type="error"
            title="Pedido no encontrado"
            message={error}
            onClose={() => {
              setSearched(false);
              setOrderCode("");
            }}
          />
        )}
      </Card>

      {order && (
        <Card className="space-y-4 border-l-4 border-l-success">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-text-muted">Código de Pedido</p>
                <h3 className="text-3xl font-bold text-text font-mono">
                  {order.code}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted">Estado</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : order.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : order.status === "delivered"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                  }`}
                >
                  {order.status === "pending"
                    ? "Pendiente"
                    : order.status === "paid"
                      ? "Pagado"
                      : order.status === "delivered"
                        ? "Entregado"
                        : "Cancelado"}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <h4 className="font-semibold text-text">Productos</h4>
            <div className="space-y-2">
              {order.buyList.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-secondary rounded-md"
                >
                  <div>
                    <p className="font-medium text-text">{item.sku}</p>
                    {item.color && (
                      <p className="text-xs text-text-muted">Color: {item.color}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-text">x{item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <div className="bg-primary-light rounded-md p-4 flex justify-between items-center">
              <span className="font-semibold text-text">Total:</span>
              <span className="text-2xl font-bold text-primary">
                ${order.total.toFixed(2)}
              </span>
            </div>

            {order.status === "pending" && (
              <div className="flex gap-2">
                <Button
                  fullWidth
                  variant="secondary"
                  onClick={() => {
                    setSearched(false);
                    setOrderCode("");
                  }}
                >
                  Buscar Otro
                </Button>
                <Button
                  fullWidth
                  onClick={() =>
                    router.push(
                      `/cashier/orders/${order.id}?code=${order.code}`
                    )
                  }
                >
                  Procesar Pago
                </Button>
              </div>
            )}

            {(order.status === "paid" || order.status === "delivered") && (
              <Alert
                type="info"
                message={
                  order.status === "paid"
                    ? "Este pedido ya fue pagado"
                    : "Este pedido ya fue entregado"
                }
              />
            )}
          </div>
        </Card>
      )}

      <Card className="bg-primary-light border-primary-dark border-opacity-20 space-y-3">
        <h4 className="font-semibold text-text">Instrucciones</h4>
        <ol className="text-sm text-text-muted space-y-2">
          <li>1. El cliente presenta su código de pedido</li>
          <li>2. Ingresa el código en el buscador</li>
          <li>3. Verifica los productos y cantidad</li>
          <li>4. Procesa el pago si corresponde</li>
          <li>5. Marca como entregado cuando se retire</li>
        </ol>
      </Card>
    </div>
  );
}
