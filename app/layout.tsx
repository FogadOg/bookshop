import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: "Bokhandelen",
  description: "Enkel nettbutikk for bøker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="no" className="h-full antialiased">
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <CartProvider>
          <Navbar />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
