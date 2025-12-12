import { configureStore, combineReducers } from '@reduxjs/toolkit';
import tripsReducer from '././slices/tripsSlice';
import brokersReducer from '././slices/brokersSlice';
import partiesReducer from '././slices/partiesSlice';
import ownersReducer from '././slices/ownersSlice';
import laboursReducer from '././slices/laboursSlice';
import productReceivesReducer from '././slices/productReceivesSlice';
import paymentsReducer from '././slices/paymentsSlice';
import uiReducer from './slices/uiSlice';

const rootReducer = combineReducers({
  trips: tripsReducer,
  brokers: brokersReducer,
  parties: partiesReducer,
  owners: ownersReducer,
  labours: laboursReducer,
  productReceives: productReceivesReducer,
  payments: paymentsReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;