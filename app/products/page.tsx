"use client";

import { useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: { name: string };
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("Erro ao carregar produtos", err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Todos os Produtos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-2xl shadow hover:shadow-md transition bg-white p-4"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-40 w-full object-cover rounded-md mb-3"
              />
            )}

            <h2 className="text-lg font-semibold">{product.name}</h2>

            {product.category?.name && (
              <p className="text-sm text-zinc-500">
                Categoria: {product.category.name}
              </p>
            )}

            <p className="text-zinc-800 font-bold mt-2">
              R$ {Number(product.price).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
