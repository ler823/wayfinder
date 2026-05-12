import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudentProfile } from '@/context/StudentProfileContext';

export default function CompleteScreen() {
  const router = useRouter();
  const { dispatch } = useStudentProfile();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: 'COMPLETE_ONBOARDING' });
      router.replace('/(tabs)');
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ActivityIndicator size="large" color="#111" />
        <Text style={styles.message}>
          We're setting up your dashboard based on your answers.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 32, gap: 24 },
  message: { fontSize: 17, color: '#444', textAlign: 'center', lineHeight: 26 },
});
