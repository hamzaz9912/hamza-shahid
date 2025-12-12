import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Owner } from '../../types';
import { apiService } from '../api';

interface OwnersState {
  owners: Owner[];
  loading: boolean;
  error: string | null;
}

const initialState: OwnersState = {
  owners: [],
  loading: false,
  error: null,
};

export const fetchOwners = createAsyncThunk(
  'owners/fetchOwners',
  async () => {
    return await apiService.getOwners();
  }
);

export const createOwner = createAsyncThunk(
  'owners/createOwner',
  async (owner: Omit<Owner, 'id'>) => {
    return await apiService.createOwner(owner);
  }
);

export const updateOwner = createAsyncThunk(
  'owners/updateOwner',
  async ({ id, owner }: { id: string; owner: Owner }) => {
    return await apiService.updateOwner(id, owner);
  }
);

export const deleteOwner = createAsyncThunk(
  'owners/deleteOwner',
  async (id: string) => {
    await apiService.deleteOwner(id);
    return id;
  }
);

const ownersSlice = createSlice({
  name: 'owners',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOwners.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOwners.fulfilled, (state, action: PayloadAction<Owner[]>) => {
        state.loading = false;
        state.owners = action.payload;
      })
      .addCase(fetchOwners.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch owners';
      })
      .addCase(createOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOwner.fulfilled, (state, action: PayloadAction<Owner>) => {
        state.loading = false;
        state.owners.unshift(action.payload);
      })
      .addCase(createOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create owner';
      })
      .addCase(updateOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOwner.fulfilled, (state, action: PayloadAction<Owner>) => {
        state.loading = false;
        const index = state.owners.findIndex(owner => owner.id === action.payload.id || owner._id === action.payload._id);
        if (index !== -1) {
          state.owners[index] = action.payload;
        }
      })
      .addCase(updateOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update owner';
      })
      .addCase(deleteOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOwner.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.owners = state.owners.filter(owner => (owner.id || owner._id) !== action.payload);
      })
      .addCase(deleteOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete owner';
      });
  },
});

export const { clearError } = ownersSlice.actions;
export default ownersSlice.reducer;