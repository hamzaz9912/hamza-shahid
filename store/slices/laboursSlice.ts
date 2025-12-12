import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Labour } from '../../types';
import { apiService } from '../api';

interface LaboursState {
  labours: Labour[];
  loading: boolean;
  error: string | null;
}

const initialState: LaboursState = {
  labours: [],
  loading: false,
  error: null,
};

export const fetchLabours = createAsyncThunk(
  'labours/fetchLabours',
  async () => {
    return await apiService.getLabours();
  }
);

export const createLabour = createAsyncThunk(
  'labours/createLabour',
  async (labour: Omit<Labour, 'id'>) => {
    return await apiService.createLabour(labour);
  }
);

export const updateLabour = createAsyncThunk(
  'labours/updateLabour',
  async ({ id, labour }: { id: string; labour: Labour }) => {
    return await apiService.updateLabour(id, labour);
  }
);

export const deleteLabour = createAsyncThunk(
  'labours/deleteLabour',
  async (id: string) => {
    await apiService.deleteLabour(id);
    return id;
  }
);

const laboursSlice = createSlice({
  name: 'labours',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLabours.fulfilled, (state, action: PayloadAction<Labour[]>) => {
        state.loading = false;
        state.labours = action.payload;
      })
      .addCase(fetchLabours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch labours';
      })
      .addCase(createLabour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLabour.fulfilled, (state, action: PayloadAction<Labour>) => {
        state.loading = false;
        state.labours.unshift(action.payload);
      })
      .addCase(createLabour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create labour';
      })
      .addCase(updateLabour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLabour.fulfilled, (state, action: PayloadAction<Labour>) => {
        state.loading = false;
        const index = state.labours.findIndex(labour => labour.id === action.payload.id || labour._id === action.payload._id);
        if (index !== -1) {
          state.labours[index] = action.payload;
        }
      })
      .addCase(updateLabour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update labour';
      })
      .addCase(deleteLabour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLabour.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.labours = state.labours.filter(labour => (labour.id || labour._id) !== action.payload);
      })
      .addCase(deleteLabour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete labour';
      });
  },
});

export const { clearError } = laboursSlice.actions;
export default laboursSlice.reducer;