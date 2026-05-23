import { useCallback, useEffect, useState } from "react";

import api from "@/lib/api";
import type { CreateProductInput, UpdateProductInput } from "@/lib/schemas";
import type { PaginatedProducts, Product } from "@/lib/types";

interface UseProductsOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

export function useProducts({
  page = 1,
  limit = 10,
  enabled = true,
}: UseProductsOptions = {}) {
  const [data, setData] = useState<PaginatedProducts | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get<PaginatedProducts>("/products", {
        params: { page, limit },
      });

      setData(response.data);
    } catch {
      setError("Erro ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchProducts();
  }, [enabled, fetchProducts]);

  return {
    data,
    loading: enabled ? loading : false,
    error,
    refetch: fetchProducts,
  };
}

export async function getProduct(id: string): Promise<Product> {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
}

export async function createProduct(
  data: CreateProductInput,
): Promise<Product> {
  const response = await api.post<Product>("/products", data);
  return response.data;
}

export async function updateProduct(
  id: string,
  data: UpdateProductInput,
): Promise<Product> {
  const response = await api.put<Product>(`/products/${id}`, data);
  return response.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/products/${id}`);
}

export async function uploadProductImage(
  id: string,
  file: File,
): Promise<Product> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post<Product>(`/products/${id}/image`, formData);

  return response.data;
}
