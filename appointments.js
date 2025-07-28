// Mocked appointment booking flow and screens

const mockAppointments = [
    {
        id: 1,
        doctorId: 1,
        departmentId: 1,
        date: '2025-08-01',
        time: '10:00',
        patientName: 'John Doe',
        status: 'confirmed'
    },
    {
        id: 2,
        doctorId: 2,
        departmentId: 2,
        date: '2025-08-02',
        time: '11:00',
        patientName: 'Jane Smith',
        status: 'pending'
    }
];

// Function to get appointments
const getAppointments = () => {
    return mockAppointments;
};

// Function to book an appointment
const bookAppointment = (appointment) => {
    mockAppointments.push(appointment);
};

// Function to cancel an appointment
const cancelAppointment = (id) => {
    const index = mockAppointments.findIndex(app => app.id === id);
    if (index !== -1) {
        mockAppointments.splice(index, 1);
    }
};

// Exporting functions
export { getAppointments, bookAppointment, cancelAppointment };