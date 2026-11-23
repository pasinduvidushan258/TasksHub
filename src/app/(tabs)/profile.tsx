import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const DEFAULT_AVATAR =
  'https://cdn-icons-png.flaticon.com/512/3135/3135715.png';

export default function ProfileScreen() {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      const storedProfile = await AsyncStorage.getItem('studentProfile');
      if (storedProfile) {
        const parsedData = JSON.parse(storedProfile);
        setStudentName(parsedData.name || '');
        setStudentId(parsedData.id || '');
        setProfileImage(parsedData.imageUri || null);
      }
    } catch (error) {
      console.error('Failed to load profile data', error);
    }
  };

  // Gallery එකෙන් photo එකක් select කරන function එක
  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        'Permission Required',
        "You've refused to allow this app to access your photos!"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true, // Crop කරන්න පුළුවන්
      aspect: [1, 1], // Avatar එකට ගැලපෙන square crop එක
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const saveProfileData = async () => {
    if (!studentName.trim() || !studentId.trim()) {
      Alert.alert('Error', 'Please enter both Name and Student ID.');
      return;
    }

    try {
      const profileData = {
        name: studentName.trim(),
        id: studentId.trim(),
        imageUri: profileImage,
      };
      await AsyncStorage.setItem('studentProfile', JSON.stringify(profileData));
      Alert.alert('Success', 'Profile details saved successfully!');
    } catch (error) {
      console.error('Failed to save profile', error);
      Alert.alert('Error', 'Failed to save profile details.');
    }
  };

  // Local storage එකේ ඔක්කොම data මකන function එක
  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      setStudentName('');
      setStudentId('');
      setProfileImage(null);
      Alert.alert('Success', 'All local data has been wiped.');
    } catch (error) {
      console.error('Failed to clear storage', error);
      Alert.alert('Error', 'Failed to clear storage.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={pickImage}
          style={styles.imageContainer}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: profileImage ? profileImage : DEFAULT_AVATAR }}
            style={styles.avatar}
          />
          <View style={styles.editBadge}>
            <MaterialCommunityIcons name="pencil" size={16} color="#ffffff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.heading}>Student Profile</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#999999"
            value={studentName}
            onChangeText={setStudentName}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Student ID</Text>
          <TextInput
            style={styles.input}
            placeholder="CS/2020/001"
            placeholderTextColor="#999999"
            value={studentId}
            onChangeText={setStudentId}
          />
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={saveProfileData}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Save Details</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.clearButton}
          onPress={clearAllData}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>Clear All Tasks</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 16,
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e3f2fd',
    borderWidth: 2,
    borderColor: '#bbdefb',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#007bff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 24,
  },
  formGroup: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222222',
    marginBottom: 6,
  },
  input: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#d0d7de',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: '#111111',
  },
  saveButton: {
    width: '100%',
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButton: {
    width: '100%',
    backgroundColor: '#ff0000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});