import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudentProfile } from '@/context/StudentProfileContext';
import StepIndicator from '@/components/onboarding/StepIndicator';

const SCHOOLS = [
  'Cal State Long Beach',
  'Cal State LA',
  'Cal State Fullerton',
  'Cal Poly Pomona',
  'Cal State Northridge',
  'Other',
];

export default function SchoolScreen() {
  const router = useRouter();
  const { profile, dispatch } = useStudentProfile();

  function select(school: string) {
    dispatch({ type: 'SET_PROFILE', payload: { school } });
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>{'< Back'}</Text>
        </TouchableOpacity>
        <StepIndicator current={1} total={4} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>What school are you attending?</Text>
        <Text style={styles.subtitle}>This helps us use the right information for your campus.</Text>

        <View style={styles.optionList}>
          {SCHOOLS.map((school) => (
            <TouchableOpacity
              key={school}
              style={[styles.option, profile.school === school && styles.optionActive]}
              onPress={() => select(school)}
              accessibilityRole="radio"
              accessibilityState={{ checked: profile.school === school }}
            >
              <Text style={[styles.optionText, profile.school === school && styles.optionTextActive]}>
                {school}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={[styles.primaryButton, !profile.school && styles.primaryButtonDisabled]}
        onPress={() => profile.school && router.push('/(onboarding)/profile')}
        disabled={!profile.school}
      >
        <Text style={styles.primaryButtonText}>Continue</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 24, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 16 },
  back: { fontSize: 15, color: '#111' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 8, marginTop: 8 },
  subtitle: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 28 },
  optionList: { gap: 12 },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  optionActive: { borderColor: '#111', backgroundColor: '#111' },
  optionText: { fontSize: 15, color: '#333' },
  optionTextActive: { color: '#fff', fontWeight: '600' },
  primaryButton: { backgroundColor: '#111', paddingVertical: 16, alignItems: 'center' },
  primaryButtonDisabled: { backgroundColor: '#999' },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
