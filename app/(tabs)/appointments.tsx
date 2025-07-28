import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import {
  Plus,
  Filter,
  Search,
  Calendar,
  Video,
  User,
} from 'lucide-react-native';
import { RootState } from '@/store';
import { setAppointments } from '@/store/slices/appointmentSlice';
import { AppHeader } from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockDoctors, mockDepartments } from '@/data/mockData';
import { AppointmentService } from '@/services/appointmentService';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';

export default function AppointmentsScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments } = useSelector(
    (state: RootState) => state.appointments
  );
  const dispatch = useDispatch();
  const { t, language, isRTL } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('all');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const params = useLocalSearchParams();

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  useEffect(() => {
    if (params.selectedSlot) {
      const slot = JSON.parse(params.selectedSlot as string);
      bookWithDoctor(slot.doctorId, slot.date, slot.time);
    }
  }, [params.selectedSlot]);

  const loadAppointments = async () => {
    if (user) {
      try {
        const userAppointments = await AppointmentService.getAppointments(
          user.id
        );
        dispatch(setAppointments(userAppointments));
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    }
  };

  const handleBookAppointment = () => {
    showDepartments();
  };

  const showDepartments = () => {
    Alert.alert(
      'Select Department',
      'Choose a medical department',
      mockDepartments
        .map((dept) => ({
          text: language === 'ar' ? dept.nameAr : dept.name,
          onPress: () => showDoctors(dept.id),
        }))
        .concat([{ text: 'Cancel', onPress: () => {}, style: 'cancel' }])
    );
  };

  const showDoctors = (departmentId: string) => {
    const department = mockDepartments.find((d) => d.id === departmentId);
    const departmentDoctors = mockDoctors.filter(
      (d) => d.department === department?.name
    );

    Alert.alert(
      'Select Doctor',
      `Available doctors in ${department?.name}`,
      departmentDoctors
        .map((doctor) => ({
          text: `${language === 'ar' ? doctor.nameAr : doctor.name} - $${
            doctor.consultationFee
          }`,
          onPress: () =>
            router.push({
              pathname: '/AppointmentPicker',
              params: { doctorId: doctor.id },
            }),
        }))
        .concat([{ text: 'Back', onPress: showDepartments }])
    );
  };

  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event: any, selectedTime: Date | undefined) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const bookWithDoctor = async (doctorId: string, selectedDate?: string, selectedTime?: string) => {
    const doctor = mockDoctors.find(d => d.id === doctorId);
    if (!doctor || !user) return;

    try {
      const appointmentDate = selectedDate || formatDate(date);
      const appointmentTime = selectedTime || formatTime(time);

      const newAppointment = await AppointmentService.bookAppointment({
        doctorId,
        patientId: user.id,
        date: appointmentDate,
        time: appointmentTime,
        type: 'in-person',
        status: 'scheduled',
        reason: 'Consultation'
      });

      dispatch(setAppointments([...appointments, newAppointment]));
      Alert.alert('Success', 'Appointment booked successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment');
    }
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#52B788';
      case 'completed':
        return '#6B7280';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#F4A261';
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return apt.status === 'scheduled';
    if (filter === 'completed') return apt.status === 'completed';
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title={t('appointments')} />

      <View style={styles.header}>
        <View
          style={[styles.filterContainer, isRTL && styles.filterContainerRTL]}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.activeFilter,
            ]}
            onPress={() => setFilter('all')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'all' && styles.activeFilterText,
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'upcoming' && styles.activeFilter,
            ]}
            onPress={() => setFilter('upcoming')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'upcoming' && styles.activeFilterText,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'completed' && styles.activeFilter,
            ]}
            onPress={() => setFilter('completed')}
          >
            <Text
              style={[
                styles.filterText,
                filter === 'completed' && styles.activeFilterText,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBookAppointment}
        >
          <Plus size={20} color="#fff" />
          <Text style={styles.bookButtonText}>Book</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => {
            const doctor = mockDoctors.find(
              (d) => d.id === appointment.doctorId
            );
            if (!doctor) return null;

            return (
              <TouchableOpacity
                key={appointment.id}
                style={styles.appointmentCard}
                onPress={() =>
                  Alert.alert('Appointment Details', 'View appointment details')
                }
              >
                <View
                  style={[styles.cardContent, isRTL && styles.cardContentRTL]}
                >
                  <Image
                    source={{ uri: doctor.image }}
                    style={styles.doctorImage}
                  />

                  <View style={styles.appointmentInfo}>
                    <Text style={[styles.doctorName, isRTL && styles.textRTL]}>
                      {language === 'ar' ? doctor.nameAr : doctor.name}
                    </Text>
                    <Text style={[styles.specialty, isRTL && styles.textRTL]}>
                      {language === 'ar'
                        ? doctor.specialtyAr
                        : doctor.specialty}
                    </Text>

                    <View
                      style={[
                        styles.appointmentDetails,
                        isRTL && styles.appointmentDetailsRTL,
                      ]}
                    >
                      <View style={styles.detailItem}>
                        <Calendar size={16} color="#6B7280" />
                        <Text style={styles.detailText}>
                          {appointment.date}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Text style={styles.detailText}>
                          {appointment.time}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        {appointment.type === 'video' ? (
                          <Video size={16} color="#6B7280" />
                        ) : (
                          <User size={16} color="#6B7280" />
                        )}
                        <Text style={styles.detailText}>
                          {appointment.type === 'video' ? 'Video' : 'In-person'}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.statusContainer}>
                    <View
                      style={[
                        styles.status,
                        { backgroundColor: getStatusColor(appointment.status) },
                      ]}
                    >
                      <Text style={styles.statusText}>
                        {appointment.status}
                      </Text>
                    </View>
                    <Text style={styles.consultationFee}>
                      ${doctor.consultationFee}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <Calendar size={64} color="#6B7280" />
            <Text style={[styles.emptyStateTitle, isRTL && styles.textRTL]}>
              No appointments found
            </Text>
            <Text style={[styles.emptyStateText, isRTL && styles.textRTL]}>
              Book your first appointment to get started
            </Text>
            <TouchableOpacity
              style={styles.emptyStateButton}
              onPress={handleBookAppointment}
            >
              <Text style={styles.emptyStateButtonText}>Book Appointment</Text>
            </TouchableOpacity>
          </View>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={onDateChange}
            minimumDate={new Date()}
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            onChange={onTimeChange}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 4,
  },
  filterContainerRTL: {
    flexDirection: 'row-reverse',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeFilter: {
    backgroundColor: '#2E86AB',
  },
  filterText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E86AB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContentRTL: {
    flexDirection: 'row-reverse',
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  appointmentInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  textRTL: {
    textAlign: 'right',
  },
  appointmentDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  appointmentDetailsRTL: {
    flexDirection: 'row-reverse',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  consultationFee: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E86AB',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
