import { configureStore } from '@reduxjs/toolkit';
import dbReducer from '../features/dbData/dbSlice';

export const store = configureStore({
  reducer: {
    db: dbReducer,
  },
});