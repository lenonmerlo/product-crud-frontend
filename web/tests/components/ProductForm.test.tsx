import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ProductForm } from "@/components/products/ProductForm";
import type { CreateProductInput } from "@/lib/schemas";

describe("ProductForm", () => {
  it("shows error for unsupported image type", async () => {
    render(
      <ProductForm
        mode="create"
        submitLabel="Cadastrar produto"
        submittingLabel="Cadastrando..."
        onSubmit={async () => {}}
        onCancel={() => {}}
      />,
    );

    const fileInput = screen.getByLabelText("Escolher imagem", {
      selector: "input[type='file']",
    });

    const invalidFile = new File(["fake"], "invalid.gif", {
      type: "image/gif",
    });

    fireEvent.change(fileInput, { target: { files: [invalidFile] } });

    expect(
      screen.getByText("Envie uma imagem JPG, PNG ou WEBP."),
    ).toBeInTheDocument();
  });

  it("submits valid form data and selected image", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi
      .fn<(data: CreateProductInput, imageFile: File | null) => Promise<void>>()
      .mockResolvedValue();

    render(
      <ProductForm
        mode="create"
        submitLabel="Cadastrar produto"
        submittingLabel="Cadastrando..."
        onSubmit={handleSubmit}
        onCancel={() => {}}
      />,
    );

    await user.type(screen.getByLabelText(/Código do produto/i), "HNK-350");
    await user.type(screen.getByLabelText(/Descrição/i), "Heineken Lata 350ml");

    const fileInput = screen.getByLabelText("Escolher imagem", {
      selector: "input[type='file']",
    });

    const validFile = new File(["fake-image"], "foto.png", {
      type: "image/png",
    });

    await user.upload(fileInput, validFile);
    await user.click(screen.getByRole("button", { name: "Cadastrar produto" }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        codigoProduto: "HNK-350",
        descricaoProduto: "Heineken Lata 350ml",
        status: true,
      }),
      expect.objectContaining({
        name: "foto.png",
      }),
    );
  });
});
