import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Calendar } from 'lucide-react-native';
import { checkAvailability } from '@/mockAppointmentBooking';
import { validateAppointment } from '@/mockAppointmentBooking';
import { router, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { mockDoctors } from '@/data/mockData';

export default function AppointmentPicker() {
  const params = useLocalSearchParams();
  const doctorId = params.doctorId as string;
  const { user } = useSelector((state: RootState) => state.auth);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots();
    }
  }, [selectedDate]);

  const loadTimeSlots = async () => {
    setLoading(true);
    try {
      const slots = await checkAvailability(doctorId, selectedDate);
      setAvailableSlots(slots);
    } catch (error) {
      Alert.alert('Error', 'Failed to load time slots');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setAvailableSlots([]);
  };

  const getDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const handleSlotSelection = async (date: string, time: string) => {
    try {
      // Validate selection
      validateAppointment(date, time);

      // Check if doctor is still available
      const isAvailable = await checkAvailability(doctorId, date);
      if (!isAvailable.includes(time)) {
        Alert.alert('Error', 'This time slot is no longer available');
        return;
      }

      const doctor = mockDoctors.find((d) => d.id === doctorId);
      if (!doctor) {
        Alert.alert('Error', 'Doctor not found');
        return;
      }

      // Show confirmation dialog
      Alert.alert(
        'Confirm Appointment',
        `Book appointment with ${doctor.name}\nDate: ${date}\nTime: ${time}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Confirm',
            onPress: () => {
              // Navigate back with the selected slot data
              router.push({
                pathname: '/(tabs)/appointments',
                params: {
                  selectedSlot: JSON.stringify({
                    date,
                    time,
                    doctorId,
                  }),
                },
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Select Date</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.dateScroll}
      >
        {getDates().map((date) => (
          <TouchableOpacity
            key={date}
            style={[
              styles.dateButton,
              selectedDate === date && styles.selectedDate,
            ]}
            onPress={() => handleDateSelect(date)}
          >
            <Text
              style={[
                styles.dateText,
                selectedDate === date && styles.selectedDateText,
              ]}
            >
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'short',
                day: 'numeric',
              })}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedDate && (
        <>
          <Text style={styles.title}>Available Time Slots</Text>
          <ScrollView style={styles.timeContainer}>
            {loading ? (
              <Text style={styles.loadingText}>Loading available slots...</Text>
            ) : availableSlots.length > 0 ? (
              <View style={styles.timeGrid}>
                {availableSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={styles.timeSlot}
                    onPress={() => handleSlotSelection(selectedDate, time)}
                  >
                    <Text style={styles.timeText}>{time}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.noSlots}>
                No available slots for this date
              </Text>
            )}
          </ScrollView>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  dateScroll: {
    marginBottom: 24,
  },
  dateButton: {
    padding: 12,
    marginRight: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedDate: {
    backgroundColor: '#2E86AB',
  },
  dateText: {
    color: '#6B7280',
  },
  selectedDateText: {
    color: '#fff',
  },
  timeContainer: {
    flex: 1,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeSlot: {
    width: '48%',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    alignItems: 'center',
  },
  timeText: {
    color: '#1F2937',
    fontSize: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: '#6B7280',
  },
  noSlots: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 24,
  },
});
