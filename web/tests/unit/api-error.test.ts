import { getApiErrorMessage } from "@/lib/api-error";

describe("getApiErrorMessage", () => {
  it("returns backend message when it is a string", () => {
    const error = {
      isAxiosError: true,
      response: {
        data: {
          message: "Credenciais inválidas",
        },
      },
    };

    expect(getApiErrorMessage(error, "Erro padrão")).toBe(
      "Credenciais inválidas",
    );
  });

  it("returns fallback for non-axios errors", () => {
    expect(getApiErrorMessage(new Error("boom"), "Erro padrão")).toBe(
      "Erro padrão",
    );
  });

  it("returns fallback when axios message is not string", () => {
    const error = {
      isAxiosError: true,
      response: {
        data: {
          message: { text: "objeto" },
        },
      },
    };

    expect(getApiErrorMessage(error, "Erro padrão")).toBe("Erro padrão");
  });
});
