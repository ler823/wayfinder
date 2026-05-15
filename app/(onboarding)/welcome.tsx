import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudentProfile } from '@/context/StudentProfileContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { colors, radius, typeScale } from '@/constants/colors';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];

export default function WelcomeScreen() {
  const router = useRouter();
  const { profile, dispatch } = useStudentProfile();

  function selectLanguage(code: string) {
    dispatch({ type: 'SET_PROFILE', payload: { language: code } });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ResponsiveContainer style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.appName}>Wayfinder</Text>
          <Text style={styles.tagline}>
            Your personal guide to college — deadlines, planning, and support, all in one place.
          </Text>

          <Text style={styles.langLabel}>Choose your language</Text>
          <View style={styles.langRow}>
            {LANGUAGES.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.langButton,
                  profile.language === lang.code && styles.langButtonActive,
                ]}
                onPress={() => selectLanguage(lang.code)}
                accessibilityRole="radio"
                accessibilityState={{ checked: profile.language === lang.code }}
              >
                <Text
                  style={[
                    styles.langButtonText,
                    profile.language === lang.code && styles.langButtonTextActive,
                  ]}
                >
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Button
          label="Get Started"
          onPress={() => router.push('/(onboarding)/school')}
        />
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, paddingBottom: 32 },
  content: { flex: 1, justifyContent: 'center' },
  appName: {
    fontSize: typeScale['2xl'],
    fontWeight: '700',
    color: colors.navy,
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: typeScale.md,
    color: colors.text.secondary,
    lineHeight: 26,
    marginBottom: 48,
  },
  langLabel: {
    fontSize: typeScale.sm + 1,
    color: colors.text.secondary,
    marginBottom: 12,
  },
  langRow: { flexDirection: 'row', gap: 12 },
  langButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  langButtonActive: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  langButtonText: { fontSize: typeScale.base, color: colors.text.secondary },
  langButtonTextActive: { color: colors.text.inverse, fontWeight: '600' },
});
