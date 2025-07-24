import React, { useEffect } from 'react';
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
import { router } from 'expo-router';
import {
  Calendar,
  TestTube,
  Pill,
  CreditCard,
  Phone,
  Heart,
} from 'lucide-react-native';
import { RootState } from '@/store';
import { setAppointments } from '@/store/slices/appointmentSlice';
import { AppHeader } from '@/components/AppHeader';
import { QuickActionCard } from '@/components/QuickActionCard';
import { AppointmentCard } from '@/components/AppointmentCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockHealthTips, mockAppointments, mockDoctors } from '@/data/mockData';
import { AppointmentService } from '@/services/appointmentService';
import { FlatList } from 'react-native';

export default function DashboardScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { appointments } = useSelector((state: RootState) => state.appointments);
  const dispatch = useDispatch();
  const { t, language, isRTL } = useLanguage();

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadAppointments = async () => {
    if (user) {
      try {
        const userAppointments = await AppointmentService.getAppointments(user.id);
        dispatch(setAppointments(userAppointments));
      } catch (error) {
        console.error('Error loading appointments:', error);
      }
    }
  };

  const quickActions = [
    {
      title: 'Book Appointment',
      titleAr: 'حجز موعد',
      icon: Calendar,
      iconColor: '#fff',
      backgroundColor: '#2E86AB',
      onPress: () => router.push('/appointments'),
    },
    {
      title: 'Lab Results',
      titleAr: 'نتائج المختبر',
      icon: TestTube,
      iconColor: '#fff',
      backgroundColor: '#52B788',
      onPress: () => router.push('/records'),
    },
    {
      title: 'Prescriptions',
      titleAr: 'الوصفات الطبية',
      icon: Pill,
      iconColor: '#fff',
      backgroundColor: '#F4A261',
      onPress: () => router.push('/records'),
    },
    {
      title: 'Pay Bills',
      titleAr: 'دفع الفواتير',
      icon: CreditCard,
      iconColor: '#fff',
      backgroundColor: '#E63946',
      onPress: () => router.push('/bills'),
    },
    {
      title: 'Emergency',
      titleAr: 'الطوارئ',
      icon: Phone,
      iconColor: '#fff',
      backgroundColor: '#DC2626',
      onPress: () => handleEmergencyCall(),
    },
    {
      title: 'Health Tips',
      titleAr: 'نصائح صحية',
      icon: Heart,
      iconColor: '#fff',
      backgroundColor: '#7C3AED',
      onPress: () => showHealthTips(),
    },
  ];

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Services',
      'Call emergency services?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call 911', onPress: () => console.log('Emergency call') },
      ]
    );
  };

  const showHealthTips = () => {
    const tip = mockHealthTips[0];
    Alert.alert(
      language === 'ar' ? tip.titleAr : tip.title,
      language === 'ar' ? tip.contentAr : tip.content
    );
  };

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title={`${t('welcome')}, ${language === 'ar' ? user.nameAr : user.name}`}
        showNotifications={true}
        userImage={user.profileImage}
        userName={language === 'ar' ? user.nameAr : user.name}
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {t('quickActions')}
          </Text>
          <FlatList
            data={quickActions}
            keyExtractor={(_: any, index: number) => index.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }: { item: typeof quickActions[0] }) => (
              <QuickActionCard
                title={item.title}
                titleAr={item.titleAr}
                icon={item.icon}
                iconColor={item.iconColor}
                backgroundColor={item.backgroundColor}
                onPress={item.onPress}
              />
            )}
            horizontal={true}
            // numColumns={3}
            contentContainerStyle={styles.quickActionsGrid}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={[styles.sectionHeader, isRTL && styles.sectionHeaderRTL]}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {t('upcomingAppointments')}
            </Text>
            <TouchableOpacity onPress={() => router.push('/appointments')}>
              <Text style={styles.viewAllButton}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {appointments.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {appointments.slice(0, 3).map((appointment) => {
                const doctor = mockDoctors.find(d => d.id === appointment.doctorId);
                if (!doctor) return null;
                
                return (
                  <View key={appointment.id} style={styles.appointmentCardContainer}>
                    <AppointmentCard
                      appointment={appointment}
                      doctor={doctor}
                      onPress={() => console.log('Appointment pressed')}
                    />
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#6B7280" />
              <Text style={[styles.emptyStateText, isRTL && styles.textRTL]}>
                No upcoming appointments
              </Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => router.push('/appointments')}
              >
                <Text style={styles.bookButtonText}>Book Appointment</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Health Tips */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
            {t('healthTips')}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockHealthTips.map((tip) => (
              <TouchableOpacity
                key={tip.id}
                style={styles.healthTipCard}
                onPress={() => showHealthTips()}
              >
                <Image source={{ uri: tip.image }} style={styles.healthTipImage} />
                <View style={styles.healthTipContent}>
                  <Text style={[styles.healthTipTitle, isRTL && styles.textRTL]}>
                    {language === 'ar' ? tip.titleAr : tip.title}
                  </Text>
                  <Text style={[styles.healthTipText, isRTL && styles.textRTL]} numberOfLines={2}>
                    {language === 'ar' ? tip.contentAr : tip.content}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  textRTL: {
    textAlign: 'right',
  },
  viewAllButton: {
    color: '#2E86AB',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    paddingHorizontal: 8,
  },
  appointmentCardContainer: {
    width: 300,
    marginRight: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 24,
  },
  bookButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  healthTipCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 8,
    marginLeft: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  healthTipImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  healthTipContent: {
    padding: 16,
  },
  healthTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  healthTipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});