"use client";

/* eslint-disable @next/next/no-img-element */

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { createProduct, uploadProductImage } from "@/hooks/useProducts";
import {
  createProductSchema,
  type CreateProductFormInput,
  type CreateProductInput,
} from "@/lib/schemas";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export default function NewProductPage() {
  const router = useRouter();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormInput, unknown, CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: { status: true },
  });

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Envie uma imagem JPG, PNG ou WEBP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("A imagem deve ter no máximo 2MB.");
      return;
    }

    setError(null);
    setImageFile(file);
    setImagePreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return URL.createObjectURL(file);
    });
  }

  async function onSubmit(data: CreateProductInput) {
    try {
      setError(null);

      const product = await createProduct(data);

      if (imageFile) {
        await uploadProductImage(product.id, imageFile);
      }

      router.push("/products");
    } catch {
      setError(
        "Erro ao cadastrar produto. Verifique os dados e tente novamente.",
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <section className="glass-card rounded-2xl p-6">
            <h2 className="mb-4 font-semibold text-foreground">
              Informações do produto
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="codigoProduto"
                  className="mb-1 block text-sm font-medium text-foreground/85"
                >
                  Código do produto <span className="text-error">*</span>
                </label>
                <input
                  id="codigoProduto"
                  {...register("codigoProduto")}
                  placeholder="Ex: HNK-350"
                  className="input-premium w-full rounded-xl px-3 py-2.5 text-sm text-foreground"
                />
                {errors.codigoProduto && (
                  <p className="mt-1 text-xs text-error">
                    {errors.codigoProduto.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="descricaoProduto"
                  className="mb-1 block text-sm font-medium text-foreground/85"
                >
                  Descrição <span className="text-error">*</span>
                </label>
                <input
                  id="descricaoProduto"
                  {...register("descricaoProduto")}
                  placeholder="Ex: Heineken Lata 350ml"
                  className="input-premium w-full rounded-xl px-3 py-2.5 text-sm text-foreground"
                />
                {errors.descricaoProduto && (
                  <p className="mt-1 text-xs text-error">
                    {errors.descricaoProduto.message}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="status"
                  {...register("status")}
                  type="checkbox"
                  className="h-4 w-4 rounded border-brand/35 accent-brand"
                />
                <label
                  htmlFor="status"
                  className="text-sm font-medium text-foreground/85"
                >
                  Produto ativo
                </label>
              </div>
            </div>
          </section>

          <section className="glass-card rounded-2xl p-6">
            <h2 className="mb-4 font-semibold text-foreground">
              Foto do produto
            </h2>

            <div className="flex items-center gap-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview da foto do produto"
                  className="h-24 w-24 rounded-xl border border-brand/25 bg-white p-1 object-contain"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed border-brand/25 bg-surface text-muted/60">
                  <ImageIcon className="h-8 w-8" aria-hidden="true" />
                </div>
              )}

              <div>
                <label className="btn-brand inline-flex cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold">
                  Escolher imagem
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="mt-1.5 text-xs text-muted">
                  JPG, PNG ou WEBP. Máximo de 2MB.
                </p>
              </div>
            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-error/30 bg-error/10 p-3">
              <p className="text-sm text-error">{error}</p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 rounded-xl border border-brand/25 bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-brand/10"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-brand flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Cadastrando..." : "Cadastrar produto"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
