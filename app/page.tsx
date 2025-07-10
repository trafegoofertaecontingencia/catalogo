import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import Link from "next/link";

export default async function Home() {

  const session = await auth();

  if(!session) redirect("/auth/sign-in");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-300 px-4">
      <div className="w-full max-w-xl text-center p-6 sm:p-10 bg-white/90 backdrop-blur-md rounded-3xl shadow-xl border border-zinc-200">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-800 mb-4">
          Bem-vindo à <span className="text-zinc-800">Jamava</span>
        </h1>

        <p className="text-zinc-600 text-base sm:text-lg mb-6">
          Catálogo digital de produtos com qualidade e praticidade.
        </p>

        <Link
          href="/products"
          className="inline-block px-6 py-3 text-base sm:text-lg rounded-xl bg-zinc-800 hover:bg-zinc-900 transition text-white font-medium"
        >
          Ver Produtos
        </Link>
      </div>
    </div>
   
  );
}
