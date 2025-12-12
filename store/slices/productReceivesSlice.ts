import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ProductReceive } from '../../types';
import { apiService } from '../api';

interface ProductReceivesState {
  productReceives: ProductReceive[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductReceivesState = {
  productReceives: [],
  loading: false,
  error: null,
};

export const fetchProductReceives = createAsyncThunk(
  'productReceives/fetchProductReceives',
  async () => {
    return await apiService.getProductReceives();
  }
);

export const createProductReceive = createAsyncThunk(
  'productReceives/createProductReceive',
  async (productReceive: Omit<ProductReceive, 'id'>) => {
    return await apiService.createProductReceive(productReceive);
  }
);

export const updateProductReceive = createAsyncThunk(
  'productReceives/updateProductReceive',
  async ({ id, productReceive }: { id: string; productReceive: ProductReceive }) => {
    return await apiService.updateProductReceive(id, productReceive);
  }
);

export const deleteProductReceive = createAsyncThunk(
  'productReceives/deleteProductReceive',
  async (id: string) => {
    await apiService.deleteProductReceive(id);
    return id;
  }
);

const productReceivesSlice = createSlice({
  name: 'productReceives',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductReceives.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReceives.fulfilled, (state, action: PayloadAction<ProductReceive[]>) => {
        state.loading = false;
        state.productReceives = action.payload;
      })
      .addCase(fetchProductReceives.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product receives';
      })
      .addCase(createProductReceive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProductReceive.fulfilled, (state, action: PayloadAction<ProductReceive>) => {
        state.loading = false;
        state.productReceives.unshift(action.payload);
      })
      .addCase(createProductReceive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create product receive';
      })
      .addCase(updateProductReceive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductReceive.fulfilled, (state, action: PayloadAction<ProductReceive>) => {
        state.loading = false;
        const index = state.productReceives.findIndex(pr => pr.id === action.payload.id || pr._id === action.payload._id);
        if (index !== -1) {
          state.productReceives[index] = action.payload;
        }
      })
      .addCase(updateProductReceive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update product receive';
      })
      .addCase(deleteProductReceive.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProductReceive.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.productReceives = state.productReceives.filter(pr => (pr.id || pr._id) !== action.payload);
      })
      .addCase(deleteProductReceive.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete product receive';
      });
  },
});

export const { clearError } = productReceivesSlice.actions;
export default productReceivesSlice.reducer;