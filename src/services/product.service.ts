import { Product, ProductFilters, PaginatedResponse } from '../types';
import { api } from '../lib/api';

export const getProducts = async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
  const response = await api.get<PaginatedResponse<Product>>('/products', { params: filters });
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get<Product>(`/products/${id}`);
  return response.data;
};

export const getFeaturedProducts = async (limit: number = 8): Promise<Product[]> => {
  const response = await api.get<{ products: Product[] }>('/products/featured', {
    params: { limit },
  });
  return response.data.products;
};

export const getProductsByCategory = async (
  category: string,
  limit: number = 10
): Promise<Product[]> => {
  const response = await api.get<{ products: Product[] }>('/products/category/' + category, {
    params: { limit },
  });
  return response.data.products;
};

export const searchProducts = async (query: string): Promise<Product[]> => {
  const response = await api.get<{ products: Product[] }>('/products/search', {
    params: { q: query },
  });
  return response.data.products;
};
