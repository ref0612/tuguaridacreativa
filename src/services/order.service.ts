import { Order, CreateOrderDto, PaginatedResponse } from '../types';
import api from '@/lib/api/api';

export const createOrder = async (orderData: CreateOrderDto): Promise<Order> => {
  const response = await api.post<{ order: Order }>('/orders', orderData);
  return response.data.order;
};

export const getOrderById = async (orderId: string): Promise<Order> => {
  const response = await api.get<{ order: Order }>(`/orders/${orderId}`);
  return response.data.order;
};

export const getUserOrders = async (userId: string, page: number = 1, limit: number = 10): Promise<PaginatedResponse<Order>> => {
  const response = await api.get<PaginatedResponse<Order>>(`/users/${userId}/orders`, {
    params: { page, limit },
  });
  return response.data;
};

export const getAllOrders = async (filters: {
  status?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedResponse<Order>> => {
  const response = await api.get<PaginatedResponse<Order>>('/orders', { params: filters });
  return response.data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: string
): Promise<Order> => {
  const response = await api.patch<{ order: Order }>(`/orders/${orderId}/status`, { status });
  return response.data.order;
};
