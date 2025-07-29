import { useEffect } from 'react';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { View, Text, StyleSheet } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function IndexScreen() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const frameworkReady = useFrameworkReady();

  useEffect(() => {
    if (!frameworkReady) return;
    if (typeof isAuthenticated === 'undefined') return;
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, frameworkReady]);

  // Show loading only while waiting for framework or auth state
  if (!frameworkReady || typeof isAuthenticated === 'undefined') {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // Render nothing once navigation is triggered
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// Add route typing for TypeScript support
declare global {
  namespace ReactNavigation {
    interface RootParamList {
      appointmentPicker: { doctorId: string };
      // ...existing routes...
    }
  }
}
