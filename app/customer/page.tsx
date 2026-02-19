"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Alert } from "@/components/Alert";
import { Card } from "@/components/Card";
import { useProductSearch } from "@/lib/hooks";

interface OrderItem {
  sku: string;
  quantity: number;
  color?: string;
  name: string;
  price: number;
}

export default function CustomerPage() {
  const router = useRouter();
  const [sku, setSku] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [buyList, setBuyList] = useState<OrderItem[]>([]);
  const [wishList, setWishList] = useState<OrderItem[]>([]);
  const { product, loading, error, searchBySku } = useProductSearch();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku.trim()) return;
    await searchBySku(sku.trim());
  };

  const handleAddToBuyList = () => {
    if (!product) return;
    const item: OrderItem = {
      sku: product.sku,
      quantity,
      color: selectedColor || undefined,
      name: product.name,
      price: product.price,
    };
    setBuyList([...buyList, item]);
    setSku("");
    setQuantity(1);
    setSelectedColor("");
  };

  const handleAddToWishList = () => {
    if (!product) return;
    const item: OrderItem = {
      sku: product.sku,
      quantity,
      color: selectedColor || undefined,
      name: product.name,
      price: product.price,
    };
    setWishList([...wishList, item]);
    setSku("");
    setQuantity(1);
    setSelectedColor("");
  };

  const handleRemoveFromBuyList = (index: number) => {
    setBuyList(buyList.filter((_, i) => i !== index));
  };

  const handleRemoveFromWishList = (index: number) => {
    setWishList(wishList.filter((_, i) => i !== index));
  };

  const handleMoveToWishList = (index: number) => {
    const item = buyList[index];
    if (item) {
      setWishList([...wishList, item]);
      setBuyList(buyList.filter((_, i) => i !== index));
    }
  };

  const handleMoveToBuyList = (index: number) => {
    const item = wishList[index];
    if (item) {
      setBuyList([...buyList, item]);
      setWishList(wishList.filter((_, i) => i !== index));
    }
  };

  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) return;
    const newBuyList = [...buyList];
    const item = newBuyList[index];
    if (item) {
      item.quantity = newQty;
      setBuyList(newBuyList);
    }
  };

  const totalPrice = buyList.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCloseOrder = async () => {
    if (buyList.length === 0) {
      alert("Debes agregar al menos un producto a tu compra");
      return;
    }
    router.push(
      `/customer/confirmation?items=${encodeURIComponent(JSON.stringify(buyList))}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary-light rounded-lg p-4 border border-primary-dark border-opacity-20">
        <h2 className="font-semibold text-text mb-2">Cómo funciona</h2>
        <ol className="text-sm text-text-muted space-y-1">
          <li>1. Ingresa el código SKU del producto</li>
          <li>2. Confirma el producto y cantidad</li>
          <li>3. Agrégalo a tu compra</li>
          <li>4. Repite mientras recorres el local</li>
          <li>5. Cierra tu pedido y ve a caja</li>
        </ol>
      </div>

      <Card className="space-y-4">
        <h3 className="section-title">Buscar Producto</h3>
        <form onSubmit={handleSearch} className="space-y-3">
          <Input
            label="Código del Producto (SKU)"
            placeholder="Ej: SKU123456"
            value={sku}
            onChange={(e) => setSku(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <Button fullWidth loading={loading}>
            Buscar
          </Button>
        </form>

        {error && (
          <Alert
            type="error"
            title="Producto no encontrado"
            message={error}
            onClose={() => setSku("")}
          />
        )}

        {product && (
          <div className="border-t border-border pt-4 space-y-3">
            <div>
              <p className="text-sm text-text-muted">Producto encontrado</p>
              <h4 className="text-lg font-semibold text-text">{product.name}</h4>
            </div>

            {product.description && (
              <p className="text-sm text-text-muted">{product.description}</p>
            )}

            <div className="bg-secondary rounded-md p-3 flex justify-between items-center">
              <span className="text-text-muted">Precio unitario:</span>
              <span className="text-xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
            </div>

            {product.stock !== undefined && (
              <p className="text-sm text-text-muted">Stock disponible: {product.stock}</p>
            )}

            {product.colors && product.colors.length > 0 && (
              <div>
                <label className="text-sm font-medium text-text block mb-2">
                  Selecciona el color
                </label>
                <div className="flex gap-2 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        selectedColor === color
                          ? "bg-primary text-white"
                          : "bg-secondary text-text hover:bg-secondary-dark border border-border"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-text block mb-2">
                Cantidad
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 bg-secondary hover:bg-secondary-dark rounded-md border border-border"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="flex-1 px-3 py-2 border border-border rounded-md text-center"
                  min="1"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 bg-secondary hover:bg-secondary-dark rounded-md border border-border"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button fullWidth onClick={handleAddToBuyList} variant="primary">
                Agregar a Compra
              </Button>
              <Button fullWidth onClick={handleAddToWishList} variant="secondary">
                Me gustó
              </Button>
            </div>
          </div>
        )}
      </Card>

      {buyList.length > 0 && (
        <Card className="space-y-4">
          <div>
            <h3 className="section-title">Tu Compra</h3>
            <p className="text-sm text-text-muted mt-1">
              {buyList.length} producto{buyList.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-2">
            {buyList.map((item, index) => (
              <div
                key={index}
                className="bg-secondary rounded-md p-3 space-y-2"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-semibold text-text">{item.name}</p>
                    {item.color && (
                      <p className="text-xs text-text-muted">Color: {item.color}</p>
                    )}
                  </div>
                  <p className="font-semibold text-primary">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleUpdateQuantity(index, item.quantity - 1)
                      }
                      className="px-2 py-1 text-sm bg-white border border-border rounded hover:bg-secondary-dark"
                    >
                      −
                    </button>
                    <span className="px-2 font-medium text-text">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleUpdateQuantity(index, item.quantity + 1)
                      }
                      className="px-2 py-1 text-sm bg-white border border-border rounded hover:bg-secondary-dark"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleMoveToWishList(index)}
                      className="text-xs px-2 py-1 text-primary hover:bg-primary-light rounded"
                      title="Mover a Me gustó"
                    >
                      ♡
                    </button>
                    <button
                      onClick={() => handleRemoveFromBuyList(index)}
                      className="text-xs px-2 py-1 text-error hover:bg-red-50 rounded"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-text-muted">Subtotal:</span>
              <span className="font-semibold text-text">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
            <div className="bg-primary-light rounded-md p-3 flex justify-between items-center">
              <span className="font-semibold text-text">Total estimado:</span>
              <span className="text-2xl font-bold text-primary">
                ${totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      )}

      {wishList.length > 0 && (
        <Card className="space-y-4">
          <div>
            <h3 className="section-title">Me Gustó</h3>
            <p className="text-sm text-text-muted mt-1">
              {wishList.length} producto{wishList.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="space-y-2">
            {wishList.map((item, index) => (
              <div
                key={index}
                className="bg-secondary rounded-md p-3 flex justify-between items-start"
              >
                <div className="flex-1">
                  <p className="font-semibold text-text">{item.name}</p>
                  <p className="text-sm text-text-muted">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleMoveToBuyList(index)}
                    className="text-xs px-2 py-1 text-success hover:bg-green-100 rounded"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishList(index)}
                    className="text-xs px-2 py-1 text-error hover:bg-red-50 rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {buyList.length > 0 && (
        <Button
          fullWidth
          size="lg"
          onClick={handleCloseOrder}
          className="sticky bottom-4"
        >
          Cerrar Pedido ({buyList.length} producto{buyList.length !== 1 ? "s" : ""})
        </Button>
      )}
    </div>
  );
}
