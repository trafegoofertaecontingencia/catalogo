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
  street: z.string().min(1, "Rua é obrigatória"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string().min(1, "Estado é obrigatório"),
  zipCode: z.string().min(5, "CEP é obrigatório"),
  contact: z.string().min(10, "Contato deve ter no mínimo 10 dígitos"),
  storeImage: z
    .any()
    .refine((file) => file?.[0] instanceof File, "Imagem do estabelecimento é obrigatória"),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;

