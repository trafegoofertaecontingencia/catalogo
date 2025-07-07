import { z } from "zod";

// FRONTEND: Schema usado com react-hook-form
export const productFormSchema = z.object({
  name: z.string().min(1, "Nome obrigatório"),
  description: z.string().optional(),
  price: z.string().refine(val => !isNaN(Number(val)), {
    message: "Preço inválido",
  }),
  categoryId: z.string().min(1, "Informe a categoria"),
  image: z
    .any()
    .refine(file => file?.[0] instanceof File, "Imagem obrigatória"),
});

export type ProductFormData = z.infer<typeof productFormSchema>;
