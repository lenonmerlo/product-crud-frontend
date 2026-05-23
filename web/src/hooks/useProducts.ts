import { useCallback, useEffect, useState } from "react";

import { getApiErrorMessage } from "@/lib/api-error";
import { fetchProducts } from "@/services/products-service";
import type { PaginatedProducts } from "@/lib/types";

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

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchProducts(page, limit);
      setData(response);
    } catch (error) {
      setError(getApiErrorMessage(error, "Erro ao carregar produtos"));
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProducts();
  }, [enabled, loadProducts]);

  return {
    data,
    loading: enabled ? loading : false,
    error,
    refetch: loadProducts,
  };
}
