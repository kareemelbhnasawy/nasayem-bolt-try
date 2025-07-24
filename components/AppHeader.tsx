import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Bell, Menu } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';

interface AppHeaderProps {
  title: string;
  showNotifications?: boolean;
  showMenu?: boolean;
  userImage?: string;
  userName?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showNotifications = true,
  showMenu = false,
  userImage,
  userName
}) => {
  const { isRTL } = useLanguage();

  return (
    <View style={[styles.header, isRTL && styles.headerRTL]}>
      <View style={styles.leftSection}>
        {showMenu && (
          <TouchableOpacity style={styles.menuButton}>
            <Menu size={24} color="#2E86AB" />
          </TouchableOpacity>
        )}
        <View>
          <Text style={[styles.title, isRTL && styles.titleRTL]}>{title}</Text>
          {userName && (
            <Text style={[styles.subtitle, isRTL && styles.subtitleRTL]}>
              {userName}
            </Text>
          )}
        </View>
      </View>
      
      <View style={styles.rightSection}>
        {showNotifications && (
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={24} color="#2E86AB" />
            <View style={styles.notificationBadge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
          </TouchableOpacity>
        )}
        {userImage && (
          <Image source={{ uri: userImage }} style={styles.userImage} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  headerRTL: {
    flexDirection: 'row-reverse',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 16,
    marginLeft: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  titleRTL: {
    textAlign: 'right',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  subtitleRTL: {
    textAlign: 'right',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  userImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#2E86AB',
  },
});