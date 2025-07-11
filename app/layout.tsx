import "./globals.css";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Providers } from "./providers";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Jamava",
  description: "App Jamava",
  manifest: "/manifest.json",
  themeColor: "#0a84ff",
  icons: {
    icon: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <CartProvider>
            <Navbar />
            <Toaster
              position="top-right"
              toastOptions={{
                className: "text-lg font-medium", // você pode usar text-sm, text-lg etc.
              }}
            />
            <div className="min-h-[80vh] bg-zinc-100">{children}</div>
            <Footer />
          </CartProvider>
        </Providers>
      </body>
    </html>
  );
}
