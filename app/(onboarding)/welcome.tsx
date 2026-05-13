import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudentProfile } from '@/context/StudentProfileContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

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

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/(onboarding)/school')}
          accessibilityRole="button"
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
      </ResponsiveContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingBottom: 32,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  tagline: {
    fontSize: 17,
    color: '#444',
    lineHeight: 26,
    marginBottom: 48,
  },
  langLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  langRow: {
    flexDirection: 'row',
    gap: 12,
  },
  langButton: {
    flex: 1,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  langButtonActive: {
    borderColor: '#111',
    backgroundColor: '#111',
  },
  langButtonText: {
    fontSize: 15,
    color: '#444',
  },
  langButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#111',
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
