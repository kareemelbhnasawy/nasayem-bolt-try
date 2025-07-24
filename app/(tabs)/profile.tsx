import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { User, CreditCard as Edit, Bell, Shield, Globe, CircleHelp as HelpCircle, LogOut, Camera, Phone, Mail, Heart, CreditCard, Settings } from 'lucide-react-native';
import { RootState } from '@/store';
import { clearUser } from '@/store/slices/authSlice';
import { AppHeader } from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';
import { AuthService } from '@/services/authService';

export default function ProfileScreen() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { t, language, setLanguage, isRTL } = useLanguage();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AuthService.logout();
            dispatch(clearUser());
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleLanguageToggle = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing functionality will be implemented');
  };

  const handleChangePhoto = () => {
    Alert.alert(
      'Change Photo',
      'Select photo source',
      [
        { text: 'Camera', onPress: () => console.log('Camera') },
        { text: 'Gallery', onPress: () => console.log('Gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  if (!user) {
    return null;
  }

  const profileSections = [
    {
      title: 'Personal Information',
      titleAr: 'المعلومات الشخصية',
      items: [
        {
          icon: User,
          label: 'Edit Profile',
          labelAr: 'تعديل الملف الشخصي',
          onPress: handleEditProfile,
        },
        {
          icon: Camera,
          label: 'Change Photo',
          labelAr: 'تغيير الصورة',
          onPress: handleChangePhoto,
        },
      ],
    },
    {
      title: 'Medical Information',
      titleAr: 'المعلومات الطبية',
      items: [
        {
          icon: Heart,
          label: 'Medical History',
          labelAr: 'التاريخ الطبي',
          onPress: () => Alert.alert('Medical History', `Blood Type: ${user.medicalInfo.bloodType}\nAllergies: ${user.medicalInfo.allergies.join(', ')}\nConditions: ${user.medicalInfo.chronicConditions.join(', ')}`),
        },
        {
          icon: CreditCard,
          label: 'Insurance Details',
          labelAr: 'تفاصيل التأمين',
          onPress: () => Alert.alert('Insurance', `Provider: ${user.insurance.provider}\nPolicy: ${user.insurance.policyNumber}\nExpiry: ${user.insurance.expiryDate}`),
        },
      ],
    },
    {
      title: 'App Settings',
      titleAr: 'إعدادات التطبيق',
      items: [
        {
          icon: Globe,
          label: `Language: ${language === 'en' ? 'English' : 'العربية'}`,
          labelAr: `اللغة: ${language === 'en' ? 'English' : 'العربية'}`,
          onPress: handleLanguageToggle,
          showArrow: false,
        },
        {
          icon: Bell,
          label: 'Notifications',
          labelAr: 'الإشعارات',
          onPress: () => {},
          showSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled,
        },
        {
          icon: Shield,
          label: 'Biometric Authentication',
          labelAr: 'المصادقة البيومترية',
          onPress: () => {},
          showSwitch: true,
          switchValue: biometricsEnabled,
          onSwitchChange: setBiometricsEnabled,
        },
      ],
    },
    {
      title: 'Support',
      titleAr: 'الدعم',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          labelAr: 'المساعدة والدعم',
          onPress: () => Alert.alert('Support', 'Contact support at +966-11-1234567'),
        },
        {
          icon: Settings,
          label: 'Privacy Policy',
          labelAr: 'سياسة الخصوصية',
          onPress: () => Alert.alert('Privacy Policy', 'Privacy policy details...'),
        },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader title={t('profile')} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user.profileImage || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200' }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleChangePhoto}>
              <Camera size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.userName, isRTL && styles.textRTL]}>
            {language === 'ar' ? user.nameAr : user.name}
          </Text>
          <Text style={[styles.userEmail, isRTL && styles.textRTL]}>
            {user.email}
          </Text>
          
          <View style={[styles.contactInfo, isRTL && styles.contactInfoRTL]}>
            <View style={styles.contactItem}>
              <Phone size={16} color="#6B7280" />
              <Text style={styles.contactText}>{user.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Mail size={16} color="#6B7280" />
              <Text style={styles.contactText}>{user.email}</Text>
            </View>
          </View>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.textRTL]}>
              {language === 'ar' ? section.titleAr : section.title}
            </Text>
            
            <View style={styles.sectionItems}>
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon;
                
                return (
                  <TouchableOpacity
                    key={itemIndex}
                    style={[styles.settingItem, isRTL && styles.settingItemRTL]}
                    onPress={item.onPress}
                    disabled={item.showSwitch}
                  >
                    <View style={[styles.settingLeft, isRTL && styles.settingLeftRTL]}>
                      <View style={styles.settingIcon}>
                        <Icon size={20} color="#2E86AB" />
                      </View>
                      <Text style={[styles.settingLabel, isRTL && styles.textRTL]}>
                        {language === 'ar' ? item.labelAr : item.label}
                      </Text>
                    </View>
                    
                    <View style={styles.settingRight}>
                      {item.showSwitch ? (
                        <Switch
                          value={item.switchValue}
                          onValueChange={item.onSwitchChange}
                          trackColor={{ false: '#D1D5DB', true: '#2E86AB' }}
                          thumbColor="#fff"
                        />
                      ) : item.showArrow !== false ? (
                        <Text style={styles.arrow}>›</Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <View style={styles.bottomPadding} />
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
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#2E86AB',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#2E86AB',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  textRTL: {
    textAlign: 'right',
  },
  contactInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  contactInfoRTL: {
    flexDirection: 'row-reverse',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    padding: 16,
    paddingBottom: 0,
  },
  sectionItems: {
    paddingVertical: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemRTL: {
    flexDirection: 'row-reverse',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLeftRTL: {
    flexDirection: 'row-reverse',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  settingRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '300',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  logoutText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  bottomPadding: {
    height: 32,
  },
});