import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Trip } from '../../types';
import { apiService } from '../api';

interface TripsState {
  trips: Trip[];
  loading: boolean;
  error: string | null;
}

const initialState: TripsState = {
  trips: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchTrips = createAsyncThunk(
  'trips/fetchTrips',
  async () => {
    return await apiService.getTrips();
  }
);

export const createTrip = createAsyncThunk(
  'trips/createTrip',
  async (trip: Omit<Trip, 'id' | 'serialNumber'>) => {
    return await apiService.createTrip(trip);
  }
);

export const updateTrip = createAsyncThunk(
  'trips/updateTrip',
  async ({ id, trip }: { id: string; trip: Trip }) => {
    return await apiService.updateTrip(id, trip);
  }
);

export const deleteTrip = createAsyncThunk(
  'trips/deleteTrip',
  async (id: string) => {
    await apiService.deleteTrip(id);
    return id;
  }
);

const tripsSlice = createSlice({
  name: 'trips',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch trips
      .addCase(fetchTrips.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTrips.fulfilled, (state, action: PayloadAction<Trip[]>) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch trips';
      })
      // Create trip
      .addCase(createTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTrip.fulfilled, (state, action: PayloadAction<Trip>) => {
        state.loading = false;
        state.trips.unshift(action.payload);
      })
      .addCase(createTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create trip';
      })
      // Update trip
      .addCase(updateTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTrip.fulfilled, (state, action: PayloadAction<Trip>) => {
        state.loading = false;
        const index = state.trips.findIndex(trip => trip.id === action.payload.id || trip._id === action.payload._id);
        if (index !== -1) {
          state.trips[index] = action.payload;
        }
      })
      .addCase(updateTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update trip';
      })
      // Delete trip
      .addCase(deleteTrip.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTrip.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.trips = state.trips.filter(trip => (trip.id || trip._id) !== action.payload);
      })
      .addCase(deleteTrip.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete trip';
      });
  },
});

export const { clearError } = tripsSlice.actions;
export default tripsSlice.reducer;