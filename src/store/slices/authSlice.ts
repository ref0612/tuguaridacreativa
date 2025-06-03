import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { get, post } from '../../lib/api/api';

// Tipos
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  isEmailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  message: string | null;
}

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token') || null,
  refreshToken: localStorage.getItem('refreshToken') || null,
  isAuthenticated: false,
  loading: false,
  error: null,
  message: null,
};

// Thunks
// Iniciar sesión
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await post('/auth/login', credentials);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al iniciar sesión'
      );
    }
  }
);

// Registrar un nuevo usuario
export const register = createAsyncThunk(
  'auth/register',
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await post('/auth/register', userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Error al registrar el usuario'
      );
    }
  }
);

// Cerrar sesión
export const logoutUser = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  try {
    // Opcional: Llamar al endpoint de logout del backend si es necesario
    await post('/auth/logout', {});
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
  } finally {
    // Limpiar el estado local en cualquier caso
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    dispatch(resetAuthState());
  }
});

// Cargar el usuario actual
export const loadCurrentUser = createAsyncThunk(
  'auth/loadCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await get('/auth/me');
      return response.data;
    } catch (error: any) {
      // Si hay un error, limpiamos los tokens
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
      }
      return rejectWithValue(
        error.response?.data?.message || 'Error al cargar el usuario'
      );
    }
  }
);

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      
      // Guardar tokens en localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      
      // Limpiar tokens en caso de error
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    });

    // Register
    builder.addCase(register.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.token = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.message = '¡Registro exitoso! Por favor verifica tu correo electrónico.';
      
      // Guardar tokens en localStorage
      localStorage.setItem('token', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    });
    builder.addCase(register.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    });

    // Load Current User
    builder.addCase(loadCurrentUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(loadCurrentUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    });
    builder.addCase(loadCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = action.payload as string;
      
      // Limpiar tokens en caso de error
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      state.message = 'Sesión cerrada correctamente';
      
      // Limpiar tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    });
  },
});

export const { resetAuthState, clearError, clearMessage } = authSlice.actions;

export default authSlice.reducer;
