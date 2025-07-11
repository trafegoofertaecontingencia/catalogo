import { z } from "zod";

export const userProfileSchema = z.object({
  companyName: z.string().min(1, "Nome da empresa é obrigatório"),
  representativeName: z.string().min(1, "Nome do representante é obrigatório"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  cnpj: z
    .string()
    .min(14, "CNPJ deve conter 14 dígitos")
    .max(18, "CNPJ inválido"),
  address: z.string().min(1, "Endereço é obrigatório"),
  contact: z.string().min(10, "Contato deve ter no mínimo 10 dígitos"),
  storeImage: z
    .any()
    .refine((file) => file?.[0] instanceof File, "Imagem do estabelecimento é obrigatória"),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
