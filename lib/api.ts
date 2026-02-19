import axios, { AxiosInstance } from "axios";
import { z } from "zod";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const ProductSchema = z.object({
  id: z.string(),
  sku: z.string(),
  name: z.string(),
  price: z.number().min(0),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  stock: z.number().min(0),
  colors: z.array(z.string()).optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const OrderItemSchema = z.object({
  sku: z.string(),
  quantity: z.number().min(1),
  color: z.string().optional(),
});

export type OrderItem = z.infer<typeof OrderItemSchema>;

export const OrderSchema = z.object({
  id: z.string(),
  code: z.string(),
  buyList: z.array(OrderItemSchema),
  wishList: z.array(OrderItemSchema).optional(),
  total: z.number().min(0),
  status: z.enum(["pending", "paid", "delivered", "cancelled"]),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export type Order = z.infer<typeof OrderSchema>;

export const AuthTokenSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    name: z.string(),
    role: z.enum(["cashier", "admin"]),
  }),
});

export type AuthToken = z.infer<typeof AuthTokenSchema>;

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token");
      if (this.token) {
        this.client.defaults.headers.common["Authorization"] =
          `Bearer ${this.token}`;
      }
    }
  }

  setToken(token: string): void {
    this.token = token;
    this.client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  clearToken(): void {
    this.token = null;
    delete this.client.defaults.headers.common["Authorization"];
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  async searchProductBySku(sku: string): Promise<Product> {
    const response = await this.client.get(`/api/products/sku/${sku}`);
    return ProductSchema.parse(response.data);
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.client.get(`/api/products/${id}`);
    return ProductSchema.parse(response.data);
  }

  async listProducts(): Promise<Product[]> {
    const response = await this.client.get("/api/products");
    return z.array(ProductSchema).parse(response.data);
  }

  async createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">) {
    const response = await this.client.post("/api/products", data);
    return ProductSchema.parse(response.data);
  }

  async updateProduct(
    id: string,
    data: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>
  ) {
    const response = await this.client.put(`/api/products/${id}`, data);
    return ProductSchema.parse(response.data);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.client.delete(`/api/products/${id}`);
  }

  async createOrder(data: {
    buyList: OrderItem[];
    wishList?: OrderItem[];
  }): Promise<Order> {
    const response = await this.client.post("/api/orders", data);
    return OrderSchema.parse(response.data);
  }

  async getOrderByCode(code: string): Promise<Order> {
    const response = await this.client.get(`/api/orders/code/${code}`);
    return OrderSchema.parse(response.data);
  }

  async listOrders(): Promise<Order[]> {
    const response = await this.client.get("/api/orders");
    return z.array(OrderSchema).parse(response.data);
  }

  async getOrder(id: string): Promise<Order> {
    const response = await this.client.get(`/api/orders/${id}`);
    return OrderSchema.parse(response.data);
  }

  async updateOrderStatus(
    id: string,
    status: "pending" | "paid" | "delivered" | "cancelled"
  ): Promise<Order> {
    const response = await this.client.patch(`/api/orders/${id}/status`, {
      status,
    });
    return OrderSchema.parse(response.data);
  }

  async deleteOrder(id: string): Promise<void> {
    await this.client.delete(`/api/orders/${id}`);
  }

  async registerCashier(data: {
    email: string;
    password: string;
    name: string;
  }): Promise<AuthToken> {
    const response = await this.client.post("/api/auth/register", data);
    const parsed = AuthTokenSchema.parse(response.data);
    this.setToken(parsed.token);
    return parsed;
  }

  async loginCashier(data: {
    email: string;
    password: string;
  }): Promise<AuthToken> {
    const response = await this.client.post("/api/auth/login", data);
    const parsed = AuthTokenSchema.parse(response.data);
    this.setToken(parsed.token);
    return parsed;
  }
}

export const apiClient = new ApiClient();
