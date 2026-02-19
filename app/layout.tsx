import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Store QR",
  description: "Sistema de Autogestión de Pedidos en Local",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
