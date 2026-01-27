import "./globals.css";
import type { Metadata } from "next";
import { AppearanceControl, Providers } from "./providers";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "RavixPteroX",
  description: "External dashboard for Pterodactyl"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="bg-[color:var(--bg)] text-[color:var(--fg)] transition-colors duration-300">
        <Providers>
          <div className="min-h-screen">{children}</div>
          <AppearanceControl />
        </Providers>
      </body>
    </html>
  );
}
