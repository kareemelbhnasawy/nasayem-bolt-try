export interface User {
  id: string;
  name: string;
  nameAr: string;
  email: string;
  phone: string;
  profileImage?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalInfo: {
    bloodType: string;
    allergies: string[];
    chronicConditions: string[];
    emergencyNotes: string;
  };
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
}

export interface Doctor {
  id: string;
  name: string;
  nameAr: string;
  specialty: string;
  specialtyAr: string;
  department: string;
  departmentAr: string;
  image: string;
  rating: number;
  reviewCount: number;
  education: string[];
  experience: string;
  languages: string[];
  workingHours: {
    [key: string]: { start: string; end: string; available: boolean };
  };
  consultationFee: number;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  reason: string;
  notes?: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  type: 'lab' | 'imaging' | 'prescription' | 'vaccination' | 'vitals';
  title: string;
  titleAr: string;
  date: string;
  doctorId: string;
  data: any;
  attachments?: string[];
}

export interface Bill {
  id: string;
  patientId: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  items: {
    description: string;
    amount: number;
    insuranceCovered: boolean;
  }[];
  dueDate: string;
}

export interface Department {
  id: string;
  name: string;
  nameAr: string;
  icon: string;
  doctorCount: number;
  image: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface AppointmentFormData {
  doctorId: string;
  date: string;
  time: string;
  type: 'in-person' | 'video';
  reason: string;
}

export interface AppointmentSlot {
  date: string;
  time: string;
  doctorId: string;
}

export interface AppointmentPickerParams {
  doctorId: string;
  selectedSlot?: string;
}

export type AppointmentPickerScreenProps = {
  route: {
    params: AppointmentPickerParams;
  };
}