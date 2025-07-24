import AsyncStorage from '@react-native-async-storage/async-storage';
import { mockUsers } from '@/data/mockData';
import { User } from '@/types';

export class AuthService {
  static async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'password123') {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { success: true, user };
    }
    
    return { success: false, error: 'Invalid credentials' };
  }

  static async logout(): Promise<void> {
    await AsyncStorage.removeItem('user');
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const userString = await AsyncStorage.getItem('user');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async register(userData: Partial<User>): Promise<{ success: boolean; user?: User; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name || '',
      nameAr: userData.nameAr || '',
      email: userData.email || '',
      phone: userData.phone || '',
      emergencyContact: userData.emergencyContact || {
        name: '',
        phone: '',
        relationship: ''
      },
      medicalInfo: userData.medicalInfo || {
        bloodType: '',
        allergies: [],
        chronicConditions: [],
        emergencyNotes: ''
      },
      insurance: userData.insurance || {
        provider: '',
        policyNumber: '',
        expiryDate: ''
      }
    };
    
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
    return { success: true, user: newUser };
  }
}