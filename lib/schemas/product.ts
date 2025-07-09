import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  categoryId: z.string().min(1),
  barcode: z.string().min(8).max(20),
});

export type ProductSchema = z.infer<typeof productSchema>;