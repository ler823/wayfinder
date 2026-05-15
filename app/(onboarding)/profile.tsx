import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudentProfile } from '@/context/StudentProfileContext';
import StepIndicator from '@/components/onboarding/StepIndicator';
import OptionGrid from '@/components/onboarding/OptionGrid';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { colors, radius, typeScale } from '@/constants/colors';
import type { AcademicStanding } from '@/types/student';

const STANDINGS: AcademicStanding[] = ['Freshman', 'Sophomore', 'Junior', 'Senior'];

const MAJORS = [
  'Business Administration',
  'Computer Science',
  'Kinesiology',
  'Psychology',
  'Nursing',
  'Engineering',
  'Undecided',
  'Other',
];

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, dispatch } = useStudentProfile();

  const canContinue = profile.standing && profile.major;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ResponsiveContainer style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>{'‹ Back'}</Text>
          </TouchableOpacity>
          <StepIndicator current={2} total={4} />
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>Tell us about yourself</Text>
          <Text style={styles.subtitle}>This helps us personalize your dashboard.</Text>

          <Text style={styles.questionLabel}>What is your major?</Text>
          <View style={styles.optionList}>
            {MAJORS.map((major) => (
              <TouchableOpacity
                key={major}
                style={[styles.option, profile.major === major && styles.optionActive]}
                onPress={() => dispatch({ type: 'SET_PROFILE', payload: { major } })}
              >
                <Text style={[styles.optionText, profile.major === major && styles.optionTextActive]}>
                  {major}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.questionLabel}>What is your academic standing?</Text>
          <OptionGrid
            options={STANDINGS}
            selected={profile.standing}
            onSelect={(v) =>
              dispatch({ type: 'SET_PROFILE', payload: { standing: v as AcademicStanding } })
            }
          />

          <Text style={styles.questionLabel}>Are you a transfer student?</Text>
          <OptionGrid
            options={['Yes', 'No']}
            selected={profile.isTransfer ? 'Yes' : 'No'}
            onSelect={(v) =>
              dispatch({ type: 'SET_PROFILE', payload: { isTransfer: v === 'Yes' } })
            }
          />

          <Text style={styles.questionLabel}>Do you receive financial aid?</Text>
          <OptionGrid
            options={['Yes', 'No']}
            selected={profile.hasFinancialAid ? 'Yes' : 'No'}
            onSelect={(v) =>
              dispatch({ type: 'SET_PROFILE', payload: { hasFinancialAid: v === 'Yes' } })
            }
          />
        </ScrollView>

        <Button
          label="Continue"
          onPress={() => canContinue && router.push('/(onboarding)/complete')}
          disabled={!canContinue}
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
  subtitle: { fontSize: typeScale.base, color: colors.text.secondary, lineHeight: 22, marginBottom: 24 },
  questionLabel: { fontSize: typeScale.base, fontWeight: '600', color: colors.text.primary, marginBottom: 12, marginTop: 20 },
  optionList: { gap: 10 },
  option: {
    paddingVertical: 14,
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
