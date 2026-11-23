import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface Task {
  id: string;
  taskName: string;
  taskDescription: string;
}

export default function DashboardScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Failed to load tasks', error);
    }
  };

  // Screen එක focus වෙන හැම වෙලාවකම tasks ටික ආපහු load කරනවා
  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  return (
    <ImageBackground
      source={{
        uri: 'https://img.freepik.com/free-vector/isometric-time-management-concept-illustrated_52683-55534.jpg?semt=ais_hybrid&w=740&q=80',
      }}
      style={styles.background}
      imageStyle={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.heading}>Your Tasks</Text>

        <ScrollView
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        >
          {tasks.length === 0 ? (
            <Text style={styles.empty}>No tasks saved yet. Add one!</Text>
          ) : (
            tasks.map((task) => (
              <View key={task.id} style={styles.taskCard}>
                <Text style={styles.taskTitle}>{task.taskName}</Text>
                <Text style={styles.taskDescription}>
                  {task.taskDescription}
                </Text>
              </View>
            ))
          )}
        </ScrollView>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push('/add-task')}
          activeOpacity={0.85}
        >
          <Text style={styles.addButtonText}>+ Add New Task</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  backgroundImage: {
    opacity: 0.15,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#111111',
    marginBottom: 16,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 16,
  },
  empty: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 40,
  },
  taskCard: {
    backgroundColor: 'rgba(248, 249, 250, 0.95)',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e6ea',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a237e',
    marginBottom: 6,
  },
  taskDescription: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: '#008000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});