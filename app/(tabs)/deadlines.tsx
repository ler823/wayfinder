import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

export default function DeadlinesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ResponsiveContainer style={styles.inner}>
        <ThemedText type="title" style={styles.title}>Deadlines</ThemedText>
        <ThemedText style={styles.body}>Deadline list and detail coming next.</ThemedText>
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { marginTop: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 8 },
  body: { fontSize: 15, color: '#666' },
});
