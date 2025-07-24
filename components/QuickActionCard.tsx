import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickActionCardProps {
  title: string;
  titleAr: string;
  icon: LucideIcon;
  iconColor: string;
  backgroundColor: string;
  onPress: () => void;
}

export const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  titleAr,
  icon: Icon,
  iconColor,
  backgroundColor,
  onPress
}) => {
  const { language, isRTL } = useLanguage();
  
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon size={32} color={iconColor} />
      </View>
      <Text style={[styles.title, isRTL && styles.titleRTL]}>
        {language === 'ar' ? titleAr : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
    width:150,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    textAlign: 'center',
  },
  titleRTL: {
    textAlign: 'center',
  },
});