import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import { auth } from "../auth";

export const metadata: Metadata = {
  title: "Bokhandelen",
  description: "Enkel nettbutikk for bøker",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const isAdmin = !!session;

  return (
    <html lang="no" className="h-full antialiased">
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <CartProvider>
          <Navbar isAdmin={isAdmin} />
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
