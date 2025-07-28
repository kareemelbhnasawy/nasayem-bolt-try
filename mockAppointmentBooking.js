export const mockTimeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'
];

export const checkAvailability = async (doctorId, date) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return random available slots
  return mockTimeSlots.filter(() => Math.random() > 0.3);
};

export const validateAppointment = (date, time) => {
  const appointmentDate = new Date(`${date}T${time}`);
  const now = new Date();
  
  if (appointmentDate < now) {
    throw new Error('Cannot book appointments in the past');
  }
  
  // Add more validation as needed
  return true;
};
