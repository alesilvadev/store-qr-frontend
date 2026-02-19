"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Alert } from "@/components/Alert";
import { useOrder } from "@/lib/hooks";

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusUpdating, setStatusUpdating] = useState<string | null>(null);
  const { order, updateStatus, loading, fetchOrderByCode } = useOrder();
  const orderCode = searchParams.get("code");

  useEffect(() => {
    if (orderCode) {
      const loadOrder = async () => {
        try {
          await fetchOrderByCode(orderCode);
        } catch (err) {
          console.error("Failed to load order:", err);
        }
      };
      loadOrder();
    }
  }, [orderCode, fetchOrderByCode]);

  const handleStatusUpdate = async (
    newStatus: "pending" | "paid" | "delivered" | "cancelled"
  ) => {
    setStatusUpdating(newStatus);
    try {
      await updateStatus(params.id, newStatus);
      if (newStatus === "delivered") {
        setTimeout(() => router.push("/cashier/orders"), 1500);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    } finally {
      setStatusUpdating(null);
    }
  };

  if (!order) {
    return (
      <div className="space-y-4">
        <Button variant="secondary" onClick={() => router.back()}>
          ← Volver
        </Button>
        <Alert type="info" message="Cargando información del pedido..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => router.back()}>
          ← Volver
        </Button>
      </div>

      <Card className="space-y-4 border-l-4 border-l-success">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-text-muted">Código de Pedido</p>
            <h2 className="text-3xl font-bold text-text font-mono">
              {order.code}
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-muted">Estado Actual</p>
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
      </Card>

      <Card className="space-y-4">
        <h3 className="font-semibold text-text text-lg">Detalles del Pedido</h3>

        <div className="space-y-2">
          {order.buyList.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-secondary rounded-md border border-border"
            >
              <div className="flex-1">
                <p className="font-semibold text-text">{item.sku}</p>
                {item.color && (
                  <p className="text-xs text-text-muted">Color: {item.color}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-primary">x{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-text-muted">Cantidad de productos:</span>
            <span className="font-semibold text-text">
              {order.buyList.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          </div>
          <div className="bg-primary-light rounded-md p-4 flex justify-between items-center">
            <span className="font-semibold text-text">Total a Cobrar:</span>
            <span className="text-3xl font-bold text-primary">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-semibold text-text text-lg">Acciones</h3>

        {order.status === "pending" && (
          <div className="space-y-2">
            <p className="text-sm text-text-muted mb-3">
              Marca el pedido como pagado para confirmar la compra
            </p>
            <Button
              fullWidth
              size="lg"
              loading={statusUpdating === "paid" || loading}
              onClick={() => handleStatusUpdate("paid")}
            >
              Confirmar Pago (${order.total.toFixed(2)})
            </Button>
            <Button
              fullWidth
              variant="secondary"
              loading={statusUpdating === "cancelled" || loading}
              onClick={() => handleStatusUpdate("cancelled")}
            >
              Cancelar Pedido
            </Button>
          </div>
        )}

        {order.status === "paid" && (
          <div className="space-y-2">
            <p className="text-sm text-text-muted mb-3">
              El cliente está retirando su pedido
            </p>
            <Button
              fullWidth
              size="lg"
              loading={statusUpdating === "delivered" || loading}
              onClick={() => handleStatusUpdate("delivered")}
            >
              Marcar como Entregado
            </Button>
          </div>
        )}

        {order.status === "delivered" && (
          <Alert type="success" message="Pedido completado exitosamente" />
        )}

        {order.status === "cancelled" && (
          <Alert type="warning" message="Este pedido fue cancelado" />
        )}
      </Card>

      <Card className="bg-warning bg-opacity-10 border border-warning space-y-3">
        <h4 className="font-semibold text-text">Flujo de Caja</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">Pendiente de pago:</span>
            <span className="font-semibold text-text">
              {order.status === "pending" ? "Sí" : "No"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Pagado:</span>
            <span className="font-semibold text-text">
              {["paid", "delivered"].includes(order.status) ? "Sí" : "No"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">Entregado:</span>
            <span className="font-semibold text-text">
              {order.status === "delivered" ? "Sí" : "No"}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
