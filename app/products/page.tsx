"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/types/product";

import { HiDotsHorizontal } from "react-icons/hi";

import Link from "next/link";
import { useSession } from "next-auth/react";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {

  const { data: session } = useSession();

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const { dispatch } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
        // Inicializa os contadores como 1 para cada produto
        const initialQuantities: { [key: string]: number } = {};
        data.forEach((product: Product) => {
          initialQuantities[product.id] = 1;
        });
        setQuantities(initialQuantities);
      } catch (err) {
        console.error("Erro ao carregar produtos", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleIncrement = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: prev[id] + 1 }));
  };

  const handleDecrement = (id: string) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, prev[id] - 1) }));
  };

  const handleAddToCart = (product: Product) => {
    const quantity = quantities[product.id] || 1;
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
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Todos os Produtos</h1>

      {isLoading ? (
        <div className="flex justify-center">
          <span className="text-zinc-500 text-sm">Carregando produtos...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="relative border rounded-2xl shadow hover:shadow-md transition bg-white p-4 flex flex-col justify-between items-center"
            >
              {session?.user.role === "ADMIN" && <div className="absolute right-0 top-0">
                <DropdownMenu>
                  <DropdownMenuTrigger><HiDotsHorizontal size={20} /></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem><Link href={`/edit?id=${product.id}`}>Editar</Link></DropdownMenuItem>
                      <DropdownMenuItem>Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>}
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="h-40 rounded-md mb-3"
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

              <div className="mt-3 flex items-center gap-2">
                <button
                  onClick={() => handleDecrement(product.id)}
                  className="px-2 py-1 bg-zinc-200 rounded"
                >
                  –
                </button>
                <span className="font-medium">
                  {quantities[product.id] || 1}
                </span>
                <button
                  onClick={() => handleIncrement(product.id)}
                  className="px-2 py-1 bg-zinc-200 rounded"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => handleAddToCart(product)}
                className="mt-3 bg-zinc-800 text-white px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
