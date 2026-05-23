"use client";

import { LogOut, PackageOpen, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { ProductCard } from "@/components/products/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { deleteProduct } from "@/services/products-service";

export default function ProductsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [displayName] = useState<string>(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const userRaw = localStorage.getItem("user");

    if (!userRaw) {
      return "";
    }

    try {
      const parsed = JSON.parse(userRaw) as {
        name?: unknown;
        nome?: unknown;
        email?: unknown;
      };

      if (typeof parsed.name === "string" && parsed.name.trim()) {
        return parsed.name.trim();
      }

      if (typeof parsed.nome === "string" && parsed.nome.trim()) {
        return parsed.nome.trim();
      }

      if (typeof parsed.email === "string" && parsed.email.includes("@")) {
        return parsed.email.split("@")[0];
      }

      return "";
    } catch {
      return "";
    }
  });
  const [hasToken] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return (
      Boolean(localStorage.getItem("accessToken")) ||
      document.cookie.includes("accessToken=")
    );
  });

  const { data, loading, error, refetch } = useProducts({
    page,
    limit: 12,
    enabled: hasToken === true,
  });

  useEffect(() => {
    if (!hasToken) {
      router.replace("/login");
    }
  }, [hasToken, router]);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    document.cookie = "accessToken=; path=/; max-age=0";
    router.replace("/login");
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Confirma exclusão do produto?");

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id);
      await refetch();
    } catch {
      window.alert("Erro ao excluir produto");
    }
  }

  const filteredProducts = useMemo(() => {
    const products = data?.data ?? [];
    const term = search.trim().toLowerCase();

    if (!term) {
      return products;
    }

    return products.filter((product) => {
      const description = product.descricaoProduto.toLowerCase();
      const code = product.codigoProduto.toLowerCase();

      return description.includes(term) || code.includes(term);
    });
  }, [data?.data, search]);

  return (
    <div className="auth-shell min-h-screen">
      <header className="sticky top-0 z-10 border-b border-brand/15 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand/65">
              Painel Comercial
            </p>
            <div className="mt-1 flex items-center gap-2.5">
              <span
                aria-hidden
                className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg border border-brand/30 bg-white/70"
              >
                <span className="absolute h-3 w-3 -translate-x-0.5 rounded-full bg-accent/95" />
                <span className="absolute h-2 w-2 translate-x-1.5 translate-y-1.5 rounded-full bg-brand/90" />
              </span>
              <h1 className="text-3xl font-semibold text-foreground [font-family:var(--font-geist-display)]">
                Lippaus
              </h1>
            </div>
            <p className="mt-1 text-sm font-medium text-muted">
              Olá{displayName ? `, ${displayName}` : ""}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.push("/products/new")}
              className="btn-brand inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Novo produto
            </button>

            <button
              type="button"
              onClick={handleLogout}
              aria-label="Sair"
              title="Sair"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand/25 text-brand transition-colors hover:bg-brand/10"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              aria-hidden="true"
            />
            <input
              type="search"
              placeholder="Buscar produto..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input-premium w-full rounded-xl py-2.5 pl-9 pr-3 text-sm text-foreground"
            />
          </div>

          {data && (
            <p className="text-sm text-muted">
              {data.meta.total} produto{data.meta.total !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand/20 border-t-brand" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-error/30 bg-error/10 p-4 text-center text-sm text-error">
            {error}
          </div>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <div className="glass-card flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand/30 px-4 py-16 text-center">
            <PackageOpen
              className="h-12 w-12 text-muted/45"
              aria-hidden="true"
            />
            <p className="mt-3 text-sm text-muted">Nenhum produto encontrado</p>
            <button
              type="button"
              onClick={() => router.push("/products/new")}
              className="btn-brand mt-4 rounded-xl px-4 py-2 text-sm font-semibold"
            >
              Cadastrar primeiro produto
            </button>
          </div>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                prioritizeImage={index < 4}
                onEdit={(id) => router.push(`/products/${id}/edit`)}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {data && data.meta.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() =>
                setPage((currentPage) => Math.max(1, currentPage - 1))
              }
              disabled={page === 1}
              className="rounded-xl border border-brand/25 bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Anterior
            </button>

            <span className="text-sm text-muted">
              {page} / {data.meta.totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                setPage((currentPage) =>
                  Math.min(data.meta.totalPages, currentPage + 1),
                )
              }
              disabled={page === data.meta.totalPages}
              className="rounded-xl border border-brand/25 bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-brand/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Próxima
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
