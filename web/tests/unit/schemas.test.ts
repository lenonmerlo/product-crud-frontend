import {
  createProductSchema,
  loginSchema,
  registerSchema,
} from "@/lib/schemas";

describe("schemas", () => {
  it("accepts valid product input and defaults status to true", () => {
    const parsed = createProductSchema.parse({
      codigoProduto: "HNK-350",
      descricaoProduto: "Heineken Lata 350ml",
    });

    expect(parsed.status).toBe(true);
  });

  it("rejects empty required product fields", () => {
    const result = createProductSchema.safeParse({
      codigoProduto: "",
      descricaoProduto: "",
      status: true,
    });

    expect(result.success).toBe(false);
  });

  it("validates login with proper email and password", () => {
    const result = loginSchema.safeParse({
      email: "user@email.com",
      password: "123456",
    });

    expect(result.success).toBe(true);
  });

  it("rejects register with short password", () => {
    const result = registerSchema.safeParse({
      name: "Lenon",
      email: "user@email.com",
      password: "123",
    });

    expect(result.success).toBe(false);
  });
});
