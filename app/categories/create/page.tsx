"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const categorySchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
});

type CategoryFormData = z.infer<typeof categorySchema>;

export default function CreateCategoryPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Erro ao criar categoria");

      setSuccess(true);
      router.push("/"); // ou /categories
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-2xl shadow bg-white">
      <h1 className="text-2xl font-bold mb-6">Criar Categoria</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium">Nome da Categoria</label>
          <input
            type="text"
            {...register("name")}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="text-center">
          <Button disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Criar"}
          </Button>
        </div>

        {success && (
          <p className="text-green-600 mt-2">Categoria criada com sucesso!</p>
        )}
      </form>
    </div>
  );
}
