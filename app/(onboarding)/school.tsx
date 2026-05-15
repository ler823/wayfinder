import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudentProfile } from '@/context/StudentProfileContext';
import StepIndicator from '@/components/onboarding/StepIndicator';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { colors, radius, typeScale } from '@/constants/colors';

const SCHOOLS = [
  'Cal State Long Beach',
  'Cal State LA',
  'Cal State Fullerton',
  'Cal Poly Pomona',
  'Cal State Northridge',
  'Cal State San Bernardino',
  'Cal State Dominguez Hills',
  'Cal State Channel Islands',
  'Cal Poly San Luis Obispo',
  'Cal State San Marcos',
  'Other',
];

export default function SchoolScreen() {
  const router = useRouter();
  const { profile, dispatch } = useStudentProfile();

  function select(school: string) {
    dispatch({ type: 'SET_PROFILE', payload: { school } });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ResponsiveContainer style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>{'‹ Back'}</Text>
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

        <Button
          label="Continue"
          onPress={() => profile.school && router.push('/(onboarding)/profile')}
          disabled={!profile.school}
        />
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, gap: 16 },
  back: { fontSize: typeScale.base, color: colors.navy, fontWeight: '500' },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 24 },
  title: { fontSize: typeScale.xl, fontWeight: '700', color: colors.text.primary, marginBottom: 8, marginTop: 8 },
  subtitle: { fontSize: typeScale.base, color: colors.text.secondary, lineHeight: 22, marginBottom: 28 },
  optionList: { gap: 10 },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  optionActive: { borderColor: colors.navy, backgroundColor: colors.navy },
  optionText: { fontSize: typeScale.base, color: colors.text.secondary },
  optionTextActive: { color: colors.text.inverse, fontWeight: '600' },
});
