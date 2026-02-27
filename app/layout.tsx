import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProCaja Elite Enterprise",
  description: "Sistema SaaS empresarial para gestión de punto de venta multi-negocio",
  keywords: ["punto de venta", "pos", "gestión empresarial", "multi-negocio"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
