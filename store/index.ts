import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import appointmentSlice from './slices/appointmentSlice';
import medicalRecordSlice from './slices/medicalRecordSlice';
import billSlice from './slices/billSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    appointments: appointmentSlice,
    medicalRecords: medicalRecordSlice,
    bills: billSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;