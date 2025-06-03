import { CartItem } from '../types';
import api from '@/lib/api/api';

export const getCart = async (): Promise<CartItem[]> => {
  const response = await api.get<{ items: CartItem[] }>('/cart');
  return response.data.items;
};

export const addToCart = async (productId: string, quantity: number = 1): Promise<CartItem> => {
  const response = await api.post<{ item: CartItem }>('/cart/items', { productId, quantity });
  return response.data.item;
};

export const updateCartItem = async (itemId: string, quantity: number): Promise<CartItem> => {
  const response = await api.patch<{ item: CartItem }>(`/cart/items/${itemId}`, { quantity });
  return response.data.item;
};

export const removeFromCart = async (itemId: string): Promise<void> => {
  await api.delete(`/cart/items/${itemId}`);
};

export const clearCart = async (): Promise<void> => {
  await api.delete('/cart');
};
