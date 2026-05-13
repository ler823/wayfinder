import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudentProfile } from '@/context/StudentProfileContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

export default function HelpScreen() {
  const { dispatch } = useStudentProfile();

  function restartOnboarding() {
    dispatch({ type: 'RESET' });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ResponsiveContainer>
        <Text style={styles.title}>Help & Glossary</Text>
        <Text style={styles.body}>Glossary and support coming next.</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Account</Text>
          <TouchableOpacity style={styles.resetButton} onPress={restartOnboarding}>
            <Text style={styles.resetButtonText}>Restart Onboarding</Text>
          </TouchableOpacity>
        </View>
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 8 },
  body: { fontSize: 15, color: '#666' },
  section: { marginTop: 40 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 12 },
  resetButton: {
    borderWidth: 1,
    borderColor: '#111',
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetButtonText: { fontSize: 15, fontWeight: '600', color: '#111' },
});
