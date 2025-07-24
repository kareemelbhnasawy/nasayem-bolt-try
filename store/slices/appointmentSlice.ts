import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appointment } from '@/types';

interface AppointmentState {
  appointments: Appointment[];
  loading: boolean;
}

const initialState: AppointmentState = {
  appointments: [],
  loading: false,
};

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.push(action.payload);
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(apt => apt.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setAppointments, addAppointment, updateAppointment, setLoading } = appointmentSlice.actions;
export default appointmentSlice.reducer;