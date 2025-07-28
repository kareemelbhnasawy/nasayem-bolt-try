import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Calendar, Video, User } from 'lucide-react-native';
import { Doctor, AppointmentFormData } from '@/types';

interface Props {
  doctor: Doctor;
  onSubmit: (data: AppointmentFormData) => void;
  onBack: () => void;
}

export function BookingForm({ doctor, onSubmit, onBack }: Props) {
  const [type, setType] = useState<'in-person' | 'video'>('in-person');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = () => {
    onSubmit({
      doctorId: doctor.id,
      date,
      time,
      type,
      reason,
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text>← Back</Text>
      </TouchableOpacity>

      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, type === 'in-person' && styles.activeType]}
          onPress={() => setType('in-person')}
        >
          <User size={20} color={type === 'in-person' ? '#fff' : '#6B7280'} />
          <Text style={[styles.typeText, type === 'in-person' && styles.activeTypeText]}>
            In-person
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 'video' && styles.activeType]}
          onPress={() => setType('video')}
        >
          <Video size={20} color={type === 'video' ? '#fff' : '#6B7280'} />
          <Text style={[styles.typeText, type === 'video' && styles.activeTypeText]}>
            Video Call
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Time (HH:MM)"
        value={time}
        onChangeText={setTime}
      />

      <TextInput
        style={[styles.input, styles.reasonInput]}
        placeholder="Reason for visit"
        value={reason}
        onChangeText={setReason}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Book Appointment</Text>
      </TouchableOpacity>
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
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#F3F4F6',
  },
  activeType: {
    backgroundColor: '#2E86AB',
  },
  typeText: {
    marginLeft: 8,
    color: '#6B7280',
  },
  activeTypeText: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  reasonInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#2E86AB',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
