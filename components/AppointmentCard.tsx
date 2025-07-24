import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Calendar, Clock, Video, User } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { Appointment, Doctor } from '@/types';

interface AppointmentCardProps {
  appointment: Appointment;
  doctor: Doctor;
  onPress: () => void;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  doctor,
  onPress
}) => {
  const { language, isRTL } = useLanguage();
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#52B788';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#EF4444';
      default: return '#F4A261';
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.content, isRTL && styles.contentRTL]}>
        <Image source={{ uri: doctor.image }} style={styles.doctorImage} />
        
        <View style={styles.info}>
          <Text style={[styles.doctorName, isRTL && styles.textRTL]}>
            {language === 'ar' ? doctor.nameAr : doctor.name}
          </Text>
          <Text style={[styles.specialty, isRTL && styles.textRTL]}>
            {language === 'ar' ? doctor.specialtyAr : doctor.specialty}
          </Text>
          
          <View style={[styles.details, isRTL && styles.detailsRTL]}>
            <View style={styles.detailItem}>
              <Calendar size={16} color="#6B7280" />
              <Text style={styles.detailText}>{appointment.date}</Text>
            </View>
            <View style={styles.detailItem}>
              <Clock size={16} color="#6B7280" />
              <Text style={styles.detailText}>{appointment.time}</Text>
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
        
        <View style={[styles.status, { backgroundColor: getStatusColor(appointment.status) }]}>
          <Text style={styles.statusText}>{appointment.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contentRTL: {
    flexDirection: 'row-reverse',
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  info: {
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
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailsRTL: {
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
  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});