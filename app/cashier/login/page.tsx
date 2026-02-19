"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Alert } from "@/components/Alert";
import { useAuth } from "@/lib/hooks";

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!email.trim()) {
      setValidationError("Ingresa tu email");
      return;
    }

    if (!password.trim()) {
      setValidationError("Ingresa tu contraseña");
      return;
    }

    try {
      await login(email, password);
      localStorage.setItem("user", JSON.stringify({ email }));
      router.push("/cashier/orders");
    } catch (err) {
      setValidationError("Email o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center -m-6 p-4 bg-bg">
      <div className="w-full max-w-md">
        <Card className="space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold text-text">Store QR</h1>
            <p className="text-text-muted">Panel de Caja</p>
          </div>

          {error && (
            <Alert
              type="error"
              title="Error en login"
              message={error}
              onClose={() => setValidationError(null)}
            />
          )}

          {validationError && (
            <Alert
              type="error"
              message={validationError}
              onClose={() => setValidationError(null)}
            />
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
            />

            <Input
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <Button fullWidth size="lg" loading={loading}>
              Iniciar Sesión
            </Button>
          </form>

          <div className="border-t border-border pt-4 text-center">
            <p className="text-xs text-text-muted">
              Usuario de prueba: demo@store.com / password
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
