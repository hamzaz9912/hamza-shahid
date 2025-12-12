import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
  loading: boolean;
  userRole: 'Admin' | 'User';
}

const initialState: UiState = {
  loading: true,
  userRole: 'Admin',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserRole: (state, action: PayloadAction<'Admin' | 'User'>) => {
      state.userRole = action.payload;
    },
  },
});

export const { setLoading, setUserRole } = uiSlice.actions;
export default uiSlice.reducer;