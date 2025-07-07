// app/cart/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    imageUrl?: string;
  };
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch("/api/cart");
        const data = await res.json();
        setItems(data.items);
        setTotal(data.total);
      } catch (error) {
        console.error("Erro ao carregar carrinho", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return <p className="text-center text-sm text-zinc-500 mt-10">Carregando carrinho...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Seu Carrinho</h1>

      {items.length === 0 ? (
        <p className="text-zinc-500">Seu carrinho está vazio.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                {item.product.imageUrl && (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                  <p className="text-sm text-zinc-500">Qtd: {item.quantity}</p>
                </div>
              </div>

              <p className="text-zinc-800 font-semibold">
                R$ {(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          <div className="text-right mt-6">
            <p className="text-lg font-bold">Total: R$ {total.toFixed(2)}</p>
          </div>

          <div className="text-right mt-4">
            <Link
              href="/checkout"
              className="bg-zinc-800 text-white px-6 py-2 rounded-xl transition"
            >
              Finalizar compra
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
