import { z } from "zod";

// FRONTEND: Schema usado com react-hook-form
export const createProductFormSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  description: z.string().optional(),
  price: z.string().refine(val => !isNaN(Number(val)), {
    message: "Preço inválido",
  }),
  categoryId: z.string().min(1, "Informe a categoria"),
  image: z
    .any()
    .refine(file => file?.[0] instanceof File, "Imagem obrigatória"),
    barcode: z.string().min(8).max(20),
});

export type ProductFormData = z.infer<typeof createProductFormSchema>;
