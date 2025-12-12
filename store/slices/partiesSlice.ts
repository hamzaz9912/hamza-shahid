import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Party } from '../../types';
import { apiService } from '../api';

interface PartiesState {
  parties: Party[];
  loading: boolean;
  error: string | null;
}

const initialState: PartiesState = {
  parties: [],
  loading: false,
  error: null,
};

export const fetchParties = createAsyncThunk(
  'parties/fetchParties',
  async () => {
    return await apiService.getParties();
  }
);

export const createParty = createAsyncThunk(
  'parties/createParty',
  async (party: Omit<Party, 'id'>) => {
    return await apiService.createParty(party);
  }
);

export const updateParty = createAsyncThunk(
  'parties/updateParty',
  async ({ id, party }: { id: string; party: Party }) => {
    return await apiService.updateParty(id, party);
  }
);

export const deleteParty = createAsyncThunk(
  'parties/deleteParty',
  async (id: string) => {
    await apiService.deleteParty(id);
    return id;
  }
);

const partiesSlice = createSlice({
  name: 'parties',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchParties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParties.fulfilled, (state, action: PayloadAction<Party[]>) => {
        state.loading = false;
        state.parties = action.payload;
      })
      .addCase(fetchParties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch parties';
      })
      .addCase(createParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createParty.fulfilled, (state, action: PayloadAction<Party>) => {
        state.loading = false;
        state.parties.unshift(action.payload);
      })
      .addCase(createParty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create party';
      })
      .addCase(updateParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateParty.fulfilled, (state, action: PayloadAction<Party>) => {
        state.loading = false;
        const index = state.parties.findIndex(party => party.id === action.payload.id || party._id === action.payload._id);
        if (index !== -1) {
          state.parties[index] = action.payload;
        }
      })
      .addCase(updateParty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update party';
      })
      .addCase(deleteParty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteParty.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.parties = state.parties.filter(party => (party.id || party._id) !== action.payload);
      })
      .addCase(deleteParty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete party';
      });
  },
});

export const { clearError } = partiesSlice.actions;
export default partiesSlice.reducer;