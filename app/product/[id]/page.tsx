import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: {
    name: string;
  };
};

export default async function ProductPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/products/${params.id}`, {
    cache: "no-store",
  });

  if (!res.ok) return notFound();

  const product: Product = await res.json();

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
          <p className="text-sm text-zinc-500 mb-2">
            Categoria: {product.category.name}
          </p>
        )}

        <p className="text-zinc-800 text-2xl font-semibold mb-4">
          R$ {Number(product.price).toFixed(2)}
        </p>

        <p className="text-zinc-700 leading-relaxed mb-6">
          {product.description}
        </p>

        <AddToCartButton productId={product.id} />
      </div>
    </div>
  );
}
