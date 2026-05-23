import { z } from "zod";

const requiredString = (message: string) => z.string().trim().min(1, message);

const emailSchema = z
  .string()
  .trim()
  .min(1, "E-mail é obrigatório")
  .pipe(z.email("E-mail inválido"));

const passwordSchema = z
  .string()
  .min(6, "Senha deve ter no mínimo 6 caracteres");

export const createProductSchema = z.object({
  codigoProduto: requiredString("Código é obrigatório"),
  descricaoProduto: requiredString("Descrição é obrigatória"),
  status: z.boolean().default(true),
});

export const updateProductSchema = createProductSchema.partial();

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const registerSchema = z.object({
  name: requiredString("Nome é obrigatório"),
  email: emailSchema,
  password: passwordSchema,
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type updateProductInput = z.infer<typeof updateProductSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
