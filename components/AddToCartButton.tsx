"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleAdd = async () => {
    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      if (!res.ok) throw new Error("Erro ao adicionar ao carrinho");

      // Mensagem de sucesso
      setMessage("✅ Produto adicionado ao carrinho!");

      router.push("/cart");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Erro inesperado";
      setIsError(true);
      setMessage(`❌ ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={handleAdd}
        disabled={loading}
        className="bg-zinc-800 text-white px-6 py-2 rounded-xl transition hover:bg-zinc-700 disabled:opacity-50"
      >
        {loading ? "Adicionando..." : "Adicionar ao carrinho"}
      </button>

      {message && (
        <span
          className={`mt-3 text-sm ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </span>
      )}
    </div>
  );
}
