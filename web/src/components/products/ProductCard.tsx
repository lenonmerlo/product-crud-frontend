import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  prioritizeImage?: boolean;
}

function normalizeImageUrl(imageUrl: string | null): string | null {
  if (!imageUrl) {
    return null;
  }

  const trimmed = imageUrl.trim();
  if (!trimmed) {
    return null;
  }

  const maybeDecoded = /^https?%3A/i.test(trimmed)
    ? decodeURIComponent(trimmed)
    : trimmed;

  try {
    const parsedUrl = new URL(maybeDecoded);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    return parsedUrl.toString();
  } catch {
    return null;
  }
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  prioritizeImage = false,
}: ProductCardProps) {
  const [failedImageUrls, setFailedImageUrls] = useState<Record<string, true>>(
    {},
  );

  const imageCandidates = useMemo(
    () =>
      [
        normalizeImageUrl(product.thumbnailUrl),
        normalizeImageUrl(product.fotoProduto),
      ]
        .filter((value): value is string => value !== null)
        .filter((url) => !failedImageUrls[url]),
    [failedImageUrls, product.thumbnailUrl, product.fotoProduto],
  );

  const imageSrc = imageCandidates[0] ?? null;

  return (
    <article
      className={`glass-card overflow-hidden rounded-2xl transition hover:-translate-y-0.5 hover:shadow-lg ${
        !product.status ? "opacity-70" : ""
      }`}
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-b from-white to-background/70 p-2.5">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.descricaoProduto}
            fill
            sizes="(max-width: 768px) 100vw, 320px"
            loading={prioritizeImage ? "eager" : "lazy"}
            fetchPriority={prioritizeImage ? "high" : "auto"}
            className="rounded-xl object-contain object-center"
            onError={() => {
              setFailedImageUrls((currentUrls) => {
                if (!imageSrc || currentUrls[imageSrc]) {
                  return currentUrls;
                }

                return {
                  ...currentUrls,
                  [imageSrc]: true,
                };
              });
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-brand/25 bg-surface text-muted/60">
            <ImageIcon className="h-10 w-10" aria-hidden="true" />
          </div>
        )}

        <span
          className={`absolute right-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            product.status ? "bg-brand text-white" : "bg-muted/70 text-white"
          }`}
        >
          {product.status ? "Ativo" : "Inativo"}
        </span>
      </div>

      <div className="p-4">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted">
          {product.codigoProduto}
        </p>

        <h3 className="mt-1 min-h-10 text-sm font-semibold text-foreground line-clamp-2">
          {product.descricaoProduto}
        </h3>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(product.id)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-brand/25 px-3 py-2 text-xs font-semibold text-foreground transition-colors hover:bg-brand/10"
          >
            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            Editar
          </button>

          <button
            type="button"
            onClick={() => onDelete(product.id)}
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-error/30 px-3 py-2 text-xs font-semibold text-error transition-colors hover:bg-error/10"
          >
            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
            Excluir
          </button>
        </div>
      </div>
    </article>
  );
}
