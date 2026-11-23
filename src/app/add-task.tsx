import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';

interface Task {
  id: string;
  taskName: string;
  taskDescription: string;
}

export default function AddTaskScreen() {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');

  const saveTask = async () => {
    if (!taskName.trim() || !taskDescription.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // 1. කලින් save කරපු tasks ටික ගන්නවා
      const existingTasks = await AsyncStorage.getItem('tasks');
      const tasksArray: Task[] = existingTasks ? JSON.parse(existingTasks) : [];

      // 2. අලුත් task එක array එකට එකතු කරනවා
      const newTask: Task = {
        id: Date.now().toString(),
        taskName: taskName.trim(),
        taskDescription: taskDescription.trim(),
      };
      tasksArray.push(newTask);

      // 3. JSON.stringify කරලා ආපහු AsyncStorage එකේ save කරනවා
      await AsyncStorage.setItem('tasks', JSON.stringify(tasksArray));

      // 4. Permission අරගෙන Local Notification එක පෙන්නනවා
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === 'granted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Task Saved Successfully! 📚',
            body: `Don't forget to complete your ${newTask.taskName}.`,
          },
          trigger: null, // එවෙලෙම trigger වෙන්න
        });
      }

      // 5. ආපහු Dashboard එකට යනවා
      router.back();
    } catch (error) {
      console.error('Failed to save task', error);
      Alert.alert('Error', 'Failed to save task. Please try again.');
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://img.freepik.com/free-vector/isometric-time-management-concept-illustrated_52683-55534.jpg?semt=ais_hybrid&w=740&q=80',
      }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Image
            source={{
              uri: 'https://static.vecteezy.com/system/resources/previews/016/921/110/non_2x/business-task-management-illustration-concept-on-white-background-vector.jpg',
            }}
            style={styles.banner}
            resizeMode="contain"
          />

          <Text style={styles.label}>Task Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task name"
            placeholderTextColor="#777"
            value={taskName}
            onChangeText={setTaskName}
          />

          <Text style={styles.label}>Task Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter task description"
            placeholderTextColor="#777"
            value={taskDescription}
            onChangeText={setTaskDescription}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveTask}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>Save Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  background: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundImage: {
    opacity: 0.2,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  banner: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b0b8c4',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#111111',
    marginBottom: 18,
  },
  textArea: {
    minHeight: 110,
  },
  saveButton: {
    backgroundColor: '#008000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});