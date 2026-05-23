"use client";
import { ProductForm } from "@/components/products/ProductForm";
import { getApiErrorMessage } from "@/lib/api-error";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import type { CreateProductInput } from "@/lib/schemas";
import type { Product } from "@/lib/types";
import {
  getProduct,
  updateProduct,
  uploadProductImage,
} from "@/services/products-service";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        setError(null);

        const data = await getProduct(id);

        setProduct(data);
      } catch (error) {
        setError(getApiErrorMessage(error, "Erro ao carregar produto."));
      } finally {
        setLoading(false);
      }
    }

    void loadProduct();
  }, [id]);

  async function handleSubmit(
    data: CreateProductInput,
    nextImageFile: File | null,
  ) {
    try {
      setError(null);

      await updateProduct(id, data);

      if (nextImageFile) {
        await uploadProductImage(id, nextImageFile);
      }

      router.push("/products");
    } catch (error) {
      setError(
        getApiErrorMessage(
          error,
          "Erro ao atualizar produto. Verifique os dados e tente novamente.",
        ),
      );
    }
  }

  if (loading) {
    return (
      <div className="auth-shell flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
      </div>
    );
  }

  if (!product && error) {
    return (
      <div className="auth-shell flex min-h-screen items-center justify-center px-4">
        <div className="glass-card w-full max-w-md rounded-2xl p-6 text-center">
          <p className="text-sm text-error">{error}</p>
          <button
            type="button"
            onClick={() => router.replace("/products")}
            className="btn-brand mt-4 rounded-xl px-4 py-2 text-sm font-semibold"
          >
            Voltar para produtos
          </button>
        </div>
      </div>
    );
  }

  const defaultValues: CreateProductInput | undefined = product
    ? {
        codigoProduto: product.codigoProduto,
        descricaoProduto: product.descricaoProduto,
        status: product.status,
      }
    : undefined;

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
                Editar produto
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <ProductForm
          mode="edit"
          defaultValues={defaultValues}
          initialImageUrl={product?.thumbnailUrl ?? product?.fotoProduto}
          submitLabel="Salvar alterações"
          submittingLabel="Salvando..."
          onSubmit={handleSubmit}
          onCancel={() => router.back()}
          error={error}
        />
      </main>
    </div>
  );
}
