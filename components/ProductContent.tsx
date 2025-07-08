"use client";

import { useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import { Product } from "@/types/product";

export default function ProductContent({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<{ text: string; success: boolean } | null>(null);

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex flex-col items-center justify-center px-6 py-12">
      {product.imageUrl && (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="rounded-2xl w-full max-w-md h-72 object-cover shadow mb-8"
        />
      )}

      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

        {product.category?.name && (
          <p className="text-sm text-zinc-500 mb-2">Categoria: {product.category.name}</p>
        )}

        <p className="text-zinc-800 text-2xl font-semibold mb-4">
          R$ {Number(product.price).toFixed(2)}
        </p>

        <p className="text-zinc-700 leading-relaxed mb-6">{product.description}</p>

        {/* Seletor de quantidade */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <button
            onClick={handleDecrement}
            className="bg-zinc-200 px-3 py-1 rounded text-xl"
          >
            –
          </button>
          <span className="font-medium text-lg">{quantity}</span>
          <button
            onClick={handleIncrement}
            className="bg-zinc-200 px-3 py-1 rounded text-xl"
          >
            +
          </button>
        </div>

        {/* Botão de adicionar ao carrinho */}
        <AddToCartButton
          product={product}
          quantity={quantity}
        />

        {message && (
          <p className={`mt-4 text-sm ${message.success ? "text-green-600" : "text-red-600"}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  );
}
