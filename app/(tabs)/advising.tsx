import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdvisingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Advising</Text>
      <Text style={styles.body}>Advising prep coming next.</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginTop: 20, marginBottom: 8 },
  body: { fontSize: 15, color: '#666' },
});
