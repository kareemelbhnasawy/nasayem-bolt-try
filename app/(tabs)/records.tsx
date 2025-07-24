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
  TestTube,
  Camera,
  Pill,
  Syringe,
  Activity,
  FileText,
  TrendingUp,
  Calendar,
} from 'lucide-react-native';
import { RootState } from '@/store';
import { setRecords } from '@/store/slices/medicalRecordSlice';
import { AppHeader } from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockMedicalRecords, mockDoctors } from '@/data/mockData';

export default function RecordsScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const { records } = useSelector((state: RootState) => state.medicalRecords);
  const dispatch = useDispatch();
  const { t, language, isRTL } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'lab' | 'imaging' | 'prescription' | 'vaccination' | 'vitals'>('all');

  useEffect(() => {
    if (user) {
      loadRecords();
    }
  }, [user]);

  const loadRecords = () => {
    if (user) {
      const userRecords = mockMedicalRecords.filter(record => record.patientId === user.id);
      dispatch(setRecords(userRecords));
    }
  };

  const categories = [
    { id: 'all', name: 'All', nameAr: 'الكل', icon: FileText, color: '#6B7280' },
    { id: 'lab', name: 'Lab Results', nameAr: 'نتائج المختبر', icon: TestTube, color: '#EF4444' },
    { id: 'imaging', name: 'Imaging', nameAr: 'الأشعة', icon: Camera, color: '#3B82F6' },
    { id: 'prescription', name: 'Prescriptions', nameAr: 'الوصفات', icon: Pill, color: '#10B981' },
    { id: 'vaccination', name: 'Vaccinations', nameAr: 'التطعيمات', icon: Syringe, color: '#8B5CF6' },
    { id: 'vitals', name: 'Vital Signs', nameAr: 'العلامات الحيوية', icon: Activity, color: '#F59E0B' },
  ];

  const filteredRecords = records.filter(record => {
    if (selectedCategory === 'all') return true;
    return record.type === selectedCategory;
  });

  const getRecordIcon = (type: string) => {
    const category = categories.find(cat => cat.id === type);
    return category ? category.icon : FileText;
  };

  const getRecordColor = (type: string) => {
    const category = categories.find(cat => cat.id === type);
    return category ? category.color : '#6B7280';
  };

  const renderRecordCard = (record: any) => {
    const Icon = getRecordIcon(record.type);
    const color = getRecordColor(record.type);
    const doctor = mockDoctors.find(d => d.id === record.doctorId);

    return (
      <TouchableOpacity
        key={record.id}
        style={styles.recordCard}
        onPress={() => showRecordDetails(record)}
      >
        <View style={[styles.recordHeader, isRTL && styles.recordHeaderRTL]}>
          <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
            <Icon size={24} color={color} />
          </View>
          <View style={styles.recordInfo}>
            <Text style={[styles.recordTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? record.titleAr : record.title}
            </Text>
            <Text style={[styles.recordDoctor, isRTL && styles.textRTL]}>
              {doctor ? (language === 'ar' ? doctor.nameAr : doctor.name) : 'Unknown Doctor'}
            </Text>
            <View style={[styles.recordMeta, isRTL && styles.recordMetaRTL]}>
              <Calendar size={14} color="#6B7280" />
              <Text style={styles.recordDate}>{record.date}</Text>
            </View>
          </View>
          <View style={styles.recordActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {record.type === 'lab' && record.data && (
          <View style={styles.labData}>
            {Object.entries(record.data).map(([key, value]: [string, any]) => (
              <View key={key} style={[styles.labItem, isRTL && styles.labItemRTL]}>
                <Text style={styles.labName}>{key.toUpperCase()}</Text>
                <View style={styles.labResult}>
                  <Text style={[styles.labValue, { color: value.status === 'elevated' ? '#EF4444' : '#10B981' }]}>
                    {value.value} {value.unit}
                  </Text>
                  <Text style={styles.labRange}>Normal: {value.normalRange}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const showRecordDetails = (record: any) => {
    let details = `Date: ${record.date}\n`;
    
    if (record.type === 'lab' && record.data) {
      details += '\nResults:\n';
      Object.entries(record.data).forEach(([key, value]: [string, any]) => {
        details += `${key.toUpperCase()}: ${value.value} ${value.unit} (Normal: ${value.normalRange})\n`;
      });
    } else if (record.type === 'prescription' && record.data?.medications) {
      details += '\nMedications:\n';
      record.data.medications.forEach((med: any) => {
        details += `${med.name} - ${med.dosage} - ${med.frequency}\n`;
      });
    }
    
    Alert.alert(
      language === 'ar' ? record.titleAr : record.title,
      details
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title={t('records')} />
      
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
        contentContainerStyle={styles.categoryFilterContent}
      >
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                isSelected && [styles.selectedCategory, { backgroundColor: category.color }]
              ]}
              onPress={() => setSelectedCategory(category.id as any)}
            >
              <Icon
                size={20}
                color={isSelected ? '#fff' : category.color}
              />
              <Text
                style={[
                  styles.categoryText,
                  isSelected && styles.selectedCategoryText,
                  isRTL && styles.textRTL
                ]}
              >
                {language === 'ar' ? category.nameAr : category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Records List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredRecords.length > 0 ? (
          filteredRecords.map(renderRecordCard)
        ) : (
          <View style={styles.emptyState}>
            <FileText size={64} color="#6B7280" />
            <Text style={[styles.emptyStateTitle, isRTL && styles.textRTL]}>
              No records found
            </Text>
            <Text style={[styles.emptyStateText, isRTL && styles.textRTL]}>
              Your medical records will appear here
            </Text>
          </View>
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
  categoryFilter: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  categoryFilterContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  selectedCategory: {
    backgroundColor: '#2E86AB',
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  textRTL: {
    textAlign: 'right',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  recordCard: {
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
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordHeaderRTL: {
    flexDirection: 'row-reverse',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recordDoctor: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  recordMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordMetaRTL: {
    flexDirection: 'row-reverse',
  },
  recordDate: {
    marginLeft: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  recordActions: {
    alignItems: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  labData: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  labItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labItemRTL: {
    flexDirection: 'row-reverse',
  },
  labName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  labResult: {
    alignItems: 'flex-end',
  },
  labValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  labRange: {
    fontSize: 12,
    color: '#6B7280',
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
  },
});