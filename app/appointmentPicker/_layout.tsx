import { Stack } from 'expo-router';

export default function AppointmentPickerLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Book Appointment',
          headerShown: false
        }}
      />
    </Stack>
  );
}
