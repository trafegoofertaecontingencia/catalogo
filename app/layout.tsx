import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Catalogo Marccini",
  description: "Melhor preço",
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
          <Navbar/>
        <div className="min-h-[80vh] bg-zinc-100 pt-10">{children}</div>
        <Footer />
        </Providers>
      </body>
    </html>
  );
}
