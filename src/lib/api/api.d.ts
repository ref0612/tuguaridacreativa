import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

declare module '../lib/api' {
  const api: AxiosInstance & {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>>;
    put<T = any>(
      url: string,
      data?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  };

  export const get: typeof api.get;
  export const post: typeof api.post;
  export const put: typeof api.put;
  export const del: typeof api.delete;
  export default api;
}
