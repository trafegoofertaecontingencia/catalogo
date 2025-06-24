import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
// import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const inter = Inter({ subsets: ["latin"] });

console.log("GOOGLE_CLIENT_ID (layout):", process.env.GOOGLE_ID)

export const metadata: Metadata = {
  title: "Catalogo Marccini",
  description: "Melhor preço",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
          <Navbar />
            <div className="min-h-[80vh]">
              {children}
            </div>
            <Footer />
      </body>
    </html>
  );
}
