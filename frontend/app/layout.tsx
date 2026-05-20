import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Nexus ISP",
  description: "Sistema de gestion de clientes y pagos"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
