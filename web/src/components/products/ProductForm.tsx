"use client";

/* eslint-disable @next/next/no-img-element */

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon } from "lucide-react";
import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import {
  createProductSchema,
  type CreateProductFormInput,
  type CreateProductInput,
} from "@/lib/schemas";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface ProductFormProps {
  mode: "create" | "edit";
  defaultValues?: CreateProductInput;
  initialImageUrl?: string | null;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (data: CreateProductInput, imageFile: File | null) => Promise<void>;
  onCancel: () => void;
  error?: string | null;
}

export function ProductForm({
  mode,
  defaultValues,
  initialImageUrl,
  submitLabel,
  submittingLabel,
  onSubmit,
  onCancel,
  error,
}: ProductFormProps) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [localImagePreview, setLocalImagePreview] = useState<string | null>(
    null,
  );
  const [imageError, setImageError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductFormInput, unknown, CreateProductInput>({
    resolver: zodResolver(createProductSchema),
    defaultValues: defaultValues ?? { status: true },
  });

  const imagePreview = localImagePreview ?? initialImageUrl ?? null;

  useEffect(() => {
    return () => {
      if (localImagePreview) {
        URL.revokeObjectURL(localImagePreview);
      }
    };
  }, [localImagePreview]);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setImageError("Envie uma imagem JPG, PNG ou WEBP.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("A imagem deve ter no máximo 2MB.");
      return;
    }

    setImageError(null);
    setImageFile(file);
    setLocalImagePreview((currentPreview) => {
      if (currentPreview) {
        URL.revokeObjectURL(currentPreview);
      }

      return URL.createObjectURL(file);
    });
  }

  return (
    <form
      onSubmit={handleSubmit((data) => onSubmit(data, imageFile))}
      className="space-y-6"
    >
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
        <h2 className="mb-4 font-semibold text-foreground">Foto do produto</h2>

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
              {mode === "edit" && initialImageUrl
                ? "Trocar imagem"
                : "Escolher imagem"}
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
            {imageError && (
              <p className="mt-1 text-xs text-error">{imageError}</p>
            )}
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
          onClick={onCancel}
          className="flex-1 rounded-xl border border-brand/25 bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-brand/10"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-brand flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
