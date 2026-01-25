import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RavixPteroX",
  description: "External dashboard for Pterodactyl"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-zinc-50 text-zinc-900">
        <div className="min-h-screen">{children}</div>
      </body>
    </html>
  );
}
