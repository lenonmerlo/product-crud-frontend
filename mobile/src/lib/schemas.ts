import { z } from "zod";

const requiredString = (message: string) => z.string().trim().min(1, message);

export const loginSchema = z.object({
  email: z.string().trim().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const registerSchema = z.object({
  name: requiredString("Nome é obrigatório"),
  email: z.string().trim().min(1, "E-mail é obrigatório").email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export const productSchema = z.object({
  codigoProduto: requiredString("Código é obrigatório"),
  descricaoProduto: requiredString("Descrição é obrigatória"),
  status: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ProductInput = z.infer<typeof productSchema>;