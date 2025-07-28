import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { Department } from '@/types';

interface Props {
  departments: Department[];
  onSelect: (department: Department) => void;
}

export function SelectDepartment({ departments, onSelect }: Props) {
  const { language, isRTL } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Department</Text>
      <View style={styles.grid}>
        {departments.map((dept) => (
          <TouchableOpacity
            key={dept.id}
            style={styles.card}
            onPress={() => onSelect(dept)}
          >
            <Image source={{ uri: dept.image }} style={styles.image} />
            <Text style={styles.name}>
              {language === 'ar' ? dept.nameAr : dept.name}
            </Text>
            <Text style={styles.count}>{dept.doctorCount} Doctors</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  count: {
    fontSize: 14,
    color: '#6B7280',
  },
});
