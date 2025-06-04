import ClientWrapper from "./components/ClientWrapper";
import "./globals.css";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="bg-white dark:bg-gray-900">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
