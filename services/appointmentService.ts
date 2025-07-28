import { mockAppointments, mockDoctors } from '@/data/mockData';
import { Appointment, Doctor } from '@/types';

export class AppointmentService {
  static async getAppointments(patientId: string): Promise<Appointment[]> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return mockAppointments.filter(apt => apt.patientId === patientId);
  }

  static async getDoctors(): Promise<Doctor[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    return mockDoctors;
  }

  static async bookAppointment(appointmentData: Omit<Appointment, 'id'>): Promise<Appointment> {
    // Validate date and time
    const selectedDateTime = new Date(`${appointmentData.date}T${appointmentData.time}`);
    const now = new Date();

    if (selectedDateTime < now) {
      throw new Error('Cannot book appointments in the past');
    }

    // Validate doctor availability
    const isAvailable = await this.checkDoctorAvailability(
      appointmentData.doctorId,
      appointmentData.date,
      appointmentData.time
    );

    if (!isAvailable) {
      throw new Error('Selected time slot is not available');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
    };
    
    return newAppointment;
  }

  private static async checkDoctorAvailability(
    doctorId: string,
    date: string,
    time: string
  ): Promise<boolean> {
    // Mock availability check
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  static async cancelAppointment(appointmentId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return true;
  }

  static async rescheduleAppointment(appointmentId: string, newDate: string, newTime: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 800));
    return true;
  }
}