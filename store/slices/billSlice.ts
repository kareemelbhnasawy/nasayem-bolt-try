import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Bill } from '@/types';

interface BillState {
  bills: Bill[];
  loading: boolean;
}

const initialState: BillState = {
  bills: [],
  loading: false,
};

const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    setBills: (state, action: PayloadAction<Bill[]>) => {
      state.bills = action.payload;
    },
    updateBill: (state, action: PayloadAction<Bill>) => {
      const index = state.bills.findIndex(bill => bill.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setBills, updateBill, setLoading } = billSlice.actions;
export default billSlice.reducer;