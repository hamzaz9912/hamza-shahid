import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Broker } from '../../types';
import { apiService } from '../api';

interface BrokersState {
  brokers: Broker[];
  loading: boolean;
  error: string | null;
}

const initialState: BrokersState = {
  brokers: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchBrokers = createAsyncThunk(
  'brokers/fetchBrokers',
  async () => {
    return await apiService.getBrokers();
  }
);

export const createBroker = createAsyncThunk(
  'brokers/createBroker',
  async (broker: Omit<Broker, 'id'>) => {
    return await apiService.createBroker(broker);
  }
);

export const updateBroker = createAsyncThunk(
  'brokers/updateBroker',
  async ({ id, broker }: { id: string; broker: Broker }) => {
    return await apiService.updateBroker(id, broker);
  }
);

export const deleteBroker = createAsyncThunk(
  'brokers/deleteBroker',
  async (id: string) => {
    await apiService.deleteBroker(id);
    return id;
  }
);

const brokersSlice = createSlice({
  name: 'brokers',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrokers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBrokers.fulfilled, (state, action: PayloadAction<Broker[]>) => {
        state.loading = false;
        state.brokers = action.payload;
      })
      .addCase(fetchBrokers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch brokers';
      })
      .addCase(createBroker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBroker.fulfilled, (state, action: PayloadAction<Broker>) => {
        state.loading = false;
        state.brokers.unshift(action.payload);
      })
      .addCase(createBroker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create broker';
      })
      .addCase(updateBroker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBroker.fulfilled, (state, action: PayloadAction<Broker>) => {
        state.loading = false;
        const index = state.brokers.findIndex(broker => broker.id === action.payload.id || broker._id === action.payload._id);
        if (index !== -1) {
          state.brokers[index] = action.payload;
        }
      })
      .addCase(updateBroker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update broker';
      })
      .addCase(deleteBroker.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBroker.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.brokers = state.brokers.filter(broker => (broker.id || broker._id) !== action.payload);
      })
      .addCase(deleteBroker.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete broker';
      });
  },
});

export const { clearError } = brokersSlice.actions;
export default brokersSlice.reducer;