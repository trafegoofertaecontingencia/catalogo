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
import Carousel from "@/components/Carousel";

import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input";

import { LucideSearch } from "lucide-react";

import { useForm } from "react-hook-form";

import { toast } from "sonner"; // certifique-se de importar

const PRODUCTS_PER_PAGE = 10;

export default function ProductsPage() {

  const router = useRouter();

  const { register, handleSubmit, watch } = useForm();

  const { data: session } = useSession();
  const { dispatch } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});

  const totalPages = Math.ceil(totalProducts / PRODUCTS_PER_PAGE);

  const search = watch("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/products?page=${page}&search=${search}`);
        const data = await res.json();
        setProducts(data.data);
        setTotalProducts(data.meta.total);

        console.log("DATA", data);

        const initialQuantities: { [key: string]: number } = {};
        data.data.forEach((product: Product) => {
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
  }, [page, search]);

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

    toast.success(`${product.name} adicionado ao carrinho!`, {
      icon: "✅",
    });
  };

  const handleDelete = async (productId: string, productName: string) => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if(!res.ok) {
        const error = await res.json();
        console.log("Erro ao deletar", error);
        return
      };

      toast.success(`${productName} deletado com sucesso!`, {
      icon: "✅",
    });

    router.refresh();

    }catch(err) {
      console.log("Erro ao deletar")
    }
  }

  return (
    <>
      <Carousel />

    <div className="flex items-center mt-4 ml-4 border w-[50%]">
      <LucideSearch className="ml-2 mr-3 text-primary" size={20} />
      <Input
        type="text"
        placeholder="Pesquisar produtos..."
        {...register("search")}
        className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
    </div>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl text-primary font-bold mb-6">
          Todos os Produtos
        </h1>

        {isLoading ? (
          <div className="flex justify-center">
            <span className="text-zinc-500 text-sm">
              Carregando produtos...
            </span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="relative border rounded-2xl shadow hover:shadow-md transition bg-white p-4 flex flex-col justify-between items-center"
                >
                  {session?.user.role === "ADMIN" && (
                    <div className="absolute right-0 top-0">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <HiDotsHorizontal size={20} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Link href={`/edit?id=${product.id}`}>Editar</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(product.id, product.name)}>Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  )}
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
                  <p className="text-primary text-2xl font-bold mt-2">
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
                    className="mt-3 bg-primary text-white px-4 py-2 rounded-xl transition"
                  >
                    Adicionar ao Carrinho
                  </button>
                </div>
              ))}
            </div>

            {/* Paginação */}
            <div className="flex justify-center mt-8 gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Anterior
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    page === i + 1 ? "bg-primary text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Próxima
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
