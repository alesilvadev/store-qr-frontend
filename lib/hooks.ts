import { useState, useCallback, useEffect } from "react";
import { apiClient, Product, Order } from "./api";

export const useProductSearch = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBySku = useCallback(async (sku: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.searchProductBySku(sku);
      setProduct(result);
      return result;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Producto no encontrado";
      setError(message);
      setProduct(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { product, loading, error, searchBySku };
};

export const useOrder = () => {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrderByCode = useCallback(async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiClient.getOrderByCode(code);
      setOrder(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Pedido no encontrado";
      setError(message);
      setOrder(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(
    async (orderId: string, status: "pending" | "paid" | "delivered" | "cancelled") => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.updateOrderStatus(orderId, status);
        setOrder(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error actualizando pedido";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { order, loading, error, fetchOrderByCode, updateStatus };
};

export const useAuth = () => {
  const [user, setUser] = useState<{
    id: string;
    email: string;
    name: string;
    role: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiClient.loginCashier({ email, password });
        setUser(result.user);
        return result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Error en inicio de sesión";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    apiClient.clearToken();
    setUser(null);
  }, []);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (token && !user) {
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    }
  }, [user]);

  return { user, loading, error, login, logout };
};
