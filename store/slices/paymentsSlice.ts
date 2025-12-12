import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Payment } from '../../types';
import { apiService } from '../api';

interface PaymentsState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  payments: [],
  loading: false,
  error: null,
};

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async () => {
    return await apiService.getPayments();
  }
);

export const createPayment = createAsyncThunk(
  'payments/createPayment',
  async (payment: Omit<Payment, 'id'>) => {
    return await apiService.createPayment(payment);
  }
);

export const deletePayment = createAsyncThunk(
  'payments/deletePayment',
  async (id: string) => {
    await apiService.deletePayment(id);
    return id;
  }
);

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action: PayloadAction<Payment[]>) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch payments';
      })
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action: PayloadAction<Payment>) => {
        state.loading = false;
        state.payments.unshift(action.payload);
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create payment';
      })
      .addCase(deletePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayment.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.payments = state.payments.filter(payment => (payment.id || payment._id) !== action.payload);
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete payment';
      });
  },
});

export const { clearError } = paymentsSlice.actions;
export default paymentsSlice.reducer;