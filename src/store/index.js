import { configureStore } from '@reduxjs/toolkit';
import dbReducer from '../features/dbData/dbSlice';
import authReducer from '../features/auth/authSlice';
import tabReducer from '../features/sysTabs/tabSlice'

export const store = configureStore({
  reducer: {
    db: dbReducer,
    auth: authReducer,
    tabs: tabReducer,
  },
});