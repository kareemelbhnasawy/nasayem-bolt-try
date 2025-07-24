import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MedicalRecord } from '@/types';

interface MedicalRecordState {
  records: MedicalRecord[];
  loading: boolean;
}

const initialState: MedicalRecordState = {
  records: [],
  loading: false,
};

const medicalRecordSlice = createSlice({
  name: 'medicalRecords',
  initialState,
  reducers: {
    setRecords: (state, action: PayloadAction<MedicalRecord[]>) => {
      state.records = action.payload;
    },
    addRecord: (state, action: PayloadAction<MedicalRecord>) => {
      state.records.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setRecords, addRecord, setLoading } = medicalRecordSlice.actions;
export default medicalRecordSlice.reducer;