"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
};

export default function AddToCartButton({
  product,
  quantity,
}: {
  product: Product;
  quantity: number;
}) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    success: boolean;
  } | null>(null);

  const { dispatch } = useCart();

  const handleAdd = () => {
    setLoading(true);

    try {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          imageUrl: product.imageUrl || "",
        },
      });

      setMessage({ text: "Produto adicionado ao carrinho!", success: true });

      // Oculta a mensagem depois de 2 segundos
      setTimeout(() => setMessage(null), 2000);
    } catch (error) {
      setMessage({ text: "Erro ao adicionar ao carrinho", success: false });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleAdd}
        disabled={loading}
        className="bg-zinc-800 text-white px-6 py-2 rounded-xl transition"
      >
        {loading ? "Adicionando..." : "Adicionar ao carrinho"}
      </button>

      {message && (
        <span
          className={`text-sm font-medium ${
            message.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {message.text}
        </span>
      )}
    </div>
  );
}
