import "./globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "NEXUS IPS",
  description: "Conectamos salud, comunidad y futuro"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
