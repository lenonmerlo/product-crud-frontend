"use client";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ProductForm } from "@/components/products/ProductForm";
import { getApiErrorMessage } from "@/lib/api-error";
import type { CreateProductInput } from "@/lib/schemas";
import { createProduct, uploadProductImage } from "@/services/products-service";

export default function NewProductPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(
    data: CreateProductInput,
    imageFile: File | null,
  ) {
    try {
      setError(null);

      const product = await createProduct(data);

      if (imageFile) {
        await uploadProductImage(product.id, imageFile);
      }

      router.push("/products");
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Erro ao cadastrar produto. Verifique os dados e tente novamente.",
        ),
      );
    }
  }

  return (
    <div className="auth-shell min-h-screen">
      <header className="sticky top-0 z-10 border-b border-brand/15 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Voltar"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand/25 text-brand transition-colors hover:bg-brand/10"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          </button>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand/65">
              Produtos
            </p>
            <div className="mt-1 flex items-center gap-2.5">
              <span
                aria-hidden
                className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand/30 bg-white/70"
              >
                <span className="absolute h-3 w-3 -translate-x-0.5 rounded-full bg-accent/95" />
                <span className="absolute h-2 w-2 translate-x-1.5 translate-y-1.5 rounded-full bg-brand/90" />
              </span>
              <h1 className="text-2xl font-semibold text-foreground [font-family:var(--font-geist-display)]">
                Novo produto
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <ProductForm
          mode="create"
          submitLabel="Cadastrar produto"
          submittingLabel="Cadastrando..."
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          error={error}
        />
      </main>
    </div>
  );
}
