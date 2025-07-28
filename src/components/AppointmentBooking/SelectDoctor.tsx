import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Star } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { Doctor } from '@/types';

interface Props {
  doctors: Doctor[];
  onSelect: (doctor: Doctor) => void;
  onBack: () => void;
}

export function SelectDoctor({ doctors, onSelect, onBack }: Props) {
  const { language, isRTL } = useLanguage();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text>← Back</Text>
      </TouchableOpacity>

      <ScrollView>
        {doctors.map((doctor) => (
          <TouchableOpacity
            key={doctor.id}
            style={styles.card}
            onPress={() => onSelect(doctor)}
          >
            <Image source={{ uri: doctor.image }} style={styles.image} />
            <View style={styles.info}>
              <Text style={styles.name}>
                {language === 'ar' ? doctor.nameAr : doctor.name}
              </Text>
              <Text style={styles.specialty}>
                {language === 'ar' ? doctor.specialtyAr : doctor.specialty}
              </Text>
              <View style={styles.rating}>
                <Star size={16} color="#FDB022" fill="#FDB022" />
                <Text style={styles.ratingText}>
                  {doctor.rating} ({doctor.reviewCount})
                </Text>
              </View>
              <Text style={styles.fee}>${doctor.consultationFee}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    marginLeft: 4,
    color: '#6B7280',
  },
  fee: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E86AB',
  },
});
