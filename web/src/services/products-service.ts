import api from "@/lib/api";
import type { CreateProductInput, UpdateProductInput } from "@/lib/schemas";
import type { PaginatedProducts, Product } from "@/lib/types";

export async function fetchProducts(
  page = 1,
  limit = 10,
): Promise<PaginatedProducts> {
  const response = await api.get<PaginatedProducts>("/products", {
    params: { page, limit },
  });

  return response.data;
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
