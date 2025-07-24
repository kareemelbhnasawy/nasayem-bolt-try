import { User, Doctor, Appointment, MedicalRecord, Bill } from '@/types';

// Mock Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Ahmed Al-Rashid',
    nameAr: 'أحمد الراشد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    profileImage: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200',
    emergencyContact: {
      name: 'Sarah Al-Rashid',
      phone: '+966507654321',
      relationship: 'Wife'
    },
    medicalInfo: {
      bloodType: 'O+',
      allergies: ['Penicillin', 'Nuts'],
      chronicConditions: ['Diabetes Type 2'],
      emergencyNotes: 'Diabetic - check blood sugar levels'
    },
    insurance: {
      provider: 'Bupa Arabia',
      policyNumber: 'BP123456789',
      expiryDate: '2025-12-31'
    }
  }
];

// Mock Doctors
export const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Fatima Al-Zahra',
    nameAr: 'د. فاطمة الزهراء',
    specialty: 'Cardiology',
    specialtyAr: 'أمراض القلب',
    department: 'Cardiology',
    departmentAr: 'قسم أمراض القلب',
    image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 4.8,
    reviewCount: 245,
    education: ['MD - King Saud University', 'Fellowship - Mayo Clinic'],
    experience: '15 years',
    languages: ['Arabic', 'English', 'French'],
    workingHours: {
      sunday: { start: '08:00', end: '16:00', available: true },
      monday: { start: '08:00', end: '16:00', available: true },
      tuesday: { start: '08:00', end: '16:00', available: true },
      wednesday: { start: '08:00', end: '16:00', available: true },
      thursday: { start: '08:00', end: '16:00', available: true },
      friday: { start: '00:00', end: '00:00', available: false },
      saturday: { start: '00:00', end: '00:00', available: false }
    },
    consultationFee: 300
  },
  {
    id: '2',
    name: 'Dr. Omar Hassan',
    nameAr: 'د. عمر حسان',
    specialty: 'Orthopedics',
    specialtyAr: 'جراحة العظام',
    department: 'Orthopedics',
    departmentAr: 'قسم جراحة العظام',
    image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=200',
    rating: 4.9,
    reviewCount: 189,
    education: ['MD - Cairo University', 'Fellowship - Johns Hopkins'],
    experience: '12 years',
    languages: ['Arabic', 'English'],
    workingHours: {
      sunday: { start: '09:00', end: '17:00', available: true },
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '00:00', end: '00:00', available: false },
      saturday: { start: '10:00', end: '14:00', available: true }
    },
    consultationFee: 350
  }
];

// Mock Departments
export const mockDepartments = [
  {
    id: '1',
    name: 'Cardiology',
    nameAr: 'أمراض القلب',
    icon: 'heart',
    doctorCount: 8,
    image: 'https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '2',
    name: 'Orthopedics',
    nameAr: 'جراحة العظام',
    icon: 'bone',
    doctorCount: 6,
    image: 'https://images.pexels.com/photos/7659731/pexels-photo-7659731.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '3',
    name: 'Pediatrics',
    nameAr: 'طب الأطفال',
    icon: 'baby',
    doctorCount: 10,
    image: 'https://images.pexels.com/photos/7855522/pexels-photo-7855522.jpeg?auto=compress&cs=tinysrgb&w=200'
  },
  {
    id: '4',
    name: 'Neurology',
    nameAr: 'الأعصاب',
    icon: 'brain',
    doctorCount: 5,
    image: 'https://images.pexels.com/photos/7659567/pexels-photo-7659567.jpeg?auto=compress&cs=tinysrgb&w=200'
  }
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: '1',
    patientId: '1',
    date: '2024-12-25',
    time: '10:00',
    type: 'in-person',
    status: 'scheduled',
    reason: 'Regular checkup',
    notes: 'Follow-up for diabetes management'
  },
  {
    id: '2',
    doctorId: '2',
    patientId: '1',
    date: '2024-12-28',
    time: '14:30',
    type: 'video',
    status: 'scheduled',
    reason: 'Knee pain consultation'
  }
];

// Mock Medical Records
export const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '1',
    type: 'lab',
    title: 'Blood Sugar Test',
    titleAr: 'فحص السكر في الدم',
    date: '2024-12-20',
    doctorId: '1',
    data: {
      glucose: { value: 110, unit: 'mg/dL', normalRange: '70-99', status: 'elevated' },
      hba1c: { value: 7.2, unit: '%', normalRange: '4.0-5.6', status: 'elevated' }
    }
  },
  {
    id: '2',
    patientId: '1',
    type: 'prescription',
    title: 'Diabetes Medication',
    titleAr: 'أدوية السكري',
    date: '2024-12-20',
    doctorId: '1',
    data: {
      medications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' },
        { name: 'Glipizide', dosage: '5mg', frequency: 'Once daily', duration: '30 days' }
      ]
    }
  }
];

// Mock Bills
export const mockBills: Bill[] = [
  {
    id: '1',
    patientId: '1',
    date: '2024-12-20',
    amount: 750,
    status: 'pending',
    items: [
      { description: 'Consultation Fee', amount: 300, insuranceCovered: true },
      { description: 'Lab Tests', amount: 250, insuranceCovered: true },
      { description: 'Medication', amount: 200, insuranceCovered: false }
    ],
    dueDate: '2024-12-30'
  }
];

// Mock Health Tips
export const mockHealthTips = [
  {
    id: '1',
    title: 'Stay Hydrated',
    titleAr: 'حافظ على ترطيب جسمك',
    content: 'Drink at least 8 glasses of water daily for optimal health.',
    contentAr: 'اشرب ما لا يقل عن 8 أكواب من الماء يومياً للحصول على صحة مثلى.',
    image: 'https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'General Health'
  },
  {
    id: '2',
    title: 'Exercise Regularly',
    titleAr: 'مارس الرياضة بانتظام',
    content: 'Aim for at least 30 minutes of moderate exercise 5 days a week.',
    contentAr: 'اهدف إلى ممارسة الرياضة المعتدلة لمدة 30 دقيقة على الأقل 5 أيام في الأسبوع.',
    image: 'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=400',
    category: 'Fitness'
  }
];