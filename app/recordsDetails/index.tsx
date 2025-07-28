import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function RecordPDFViewerScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();
  let record: any = undefined;
  try {
    record = params.record ? JSON.parse(params.record as string) : undefined;
  } catch (e) {
    record = undefined;
  }
  if (!record) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}
      >
        <Text style={{ color: 'red', fontSize: 16 }}>
          No record data found.
        </Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: '#2E86AB' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Use a web-based PDF for Expo Go compatibility
  const getPDFUrl = () => {
    if (record.type === 'lab') {
      return 'https://drive.google.com/file/d/1LxV3BZd2ZaItHwJz_jMDykNGl6yx0Dwq/view?usp=sharing';
    } else if (record.type === 'prescription') {
      return 'https://drive.google.com/file/d/1tVQUkGXJg1I5qzGg7GqoX2ZmitfOY48U/view?usp=sharing';
    }
    return '';
  };

  const handleDownload = async () => {
    try {
      const uri = getPDFUrl();
      const fileUri =
        FileSystem.documentDirectory + `${record.title || 'record'}.pdf`;
      const downloadResumable = FileSystem.createDownloadResumable(
        uri,
        fileUri
      );
      await downloadResumable.downloadAsync();
      Alert.alert('Download', 'PDF downloaded successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to download PDF');
    }
  };

  const handleShare = async () => {
    try {
      const uri = getPDFUrl();
      const fileUri =
        FileSystem.documentDirectory + `${record.title || 'record'}.pdf`;
      // Download first if not exists
      await FileSystem.downloadAsync(uri, fileUri);
      await Sharing.shareAsync(fileUri);
    } catch (error) {
      Alert.alert('Error', 'Failed to share PDF');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={styles.headerTitleText}>{record.title}</Text>
          <Text style={styles.headerSubtitle}>{record.date}</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Feather name="share-2" size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={handleDownload}>
            <Feather name="download" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* PDF Viewer */}
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <WebView
          source={{ uri: getPDFUrl() }}
          startInLoadingState
          renderLoading={() => (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <ActivityIndicator size="large" color="#6B7280" />
            </View>
          )}
          style={styles.pdf}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    flex: 1,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionBtn: {
    padding: 8,
    marginLeft: 8,
  },
  pdf: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
