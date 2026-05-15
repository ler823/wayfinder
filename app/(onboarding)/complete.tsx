import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudentProfile } from '@/context/StudentProfileContext';
import { MAX_CONTENT_WIDTH } from '@/constants/layout';
import { colors, typeScale } from '@/constants/colors';

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
      <View style={[styles.content, { maxWidth: MAX_CONTENT_WIDTH.tablet }]}>
        <ActivityIndicator size="large" color={colors.navy} />
        <Text style={styles.message}>
          We're setting up your dashboard based on your answers.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
  content: { alignItems: 'center', paddingHorizontal: 32, gap: 24, width: '100%' },
  message: { fontSize: typeScale.md, color: colors.text.secondary, textAlign: 'center', lineHeight: 26 },
});
