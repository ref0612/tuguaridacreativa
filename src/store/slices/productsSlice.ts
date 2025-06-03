import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  numReviews: number;
}

interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  product: Product | null;
  loading: boolean;
  error: string | null;
  pages: number;
  page: number;
}

const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  product: null,
  loading: false,
  error: null,
  pages: 1,
  page: 1,
};

// Async thunks
export const fetchProducts = createAsyncThunk<
  { products: Product[]; pages: number; page: number },
  { keyword?: string; pageNumber?: number },
  { rejectValue: string }
>('products/fetchProducts', async ({ keyword = '', pageNumber = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(
      `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
    );
    return {
      products: data.products,
      pages: data.pages,
      page: data.page,
    };
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Error al cargar los productos'
    );
  }
});

export const fetchProductById = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>('products/fetchProductById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Error al cargar el producto'
    );
  }
});

export const fetchFeaturedProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>('products/fetchFeaturedProducts', async (_, { rejectWithValue }) => {
  try {
    const { data } = await axios.get('/api/products/featured');
    return data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || 'Error al cargar los productos destacados'
    );
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<{ products: Product[]; pages: number; page: number }>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      }
    );
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Product by ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.product = null;
    });
    builder.addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
      state.loading = false;
      state.product = action.payload;
    });
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Featured Products
    builder.addCase(fetchFeaturedProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchFeaturedProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
      state.loading = false;
      state.featuredProducts = action.payload;
    });
    builder.addCase(fetchFeaturedProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default productsSlice.reducer;
