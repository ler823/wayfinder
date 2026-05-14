import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ACADEMIC_ISSUES } from '@/data/academicIssues';
import { OFFICE_CONTACTS } from '@/data/officeContacts';
import { useAcademicRecovery } from '@/context/AcademicRecoveryContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

const ISSUE_TYPE_LABELS: Record<string, string> = {
  probation: 'Academic Standing',
  'transfer-credit-gap': 'Transfer Credits',
  'course-failure': 'Course Grade',
  'sap-warning': 'Financial Aid',
};

export default function AcademicRecoveryScreen() {
  const { issueId } = useLocalSearchParams<{ issueId: string }>();
  const { state, dispatch } = useAcademicRecovery();
  const router = useRouter();

  const issue = ACADEMIC_ISSUES.find((i) => i.id === issueId);

  if (!issue) {
    return (
      <SafeAreaView style={styles.container}>
        <ResponsiveContainer>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
            <Text style={styles.backLabel}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.notFound}>Issue not found.</Text>
        </ResponsiveContainer>
      </SafeAreaView>
    );
  }

  const office = OFFICE_CONTACTS.find((o) => o.id === issue.officeId);
  const isSaved = state.savedIssueIds.includes(issue.id);
  const isResolved = state.resolvedIssueIds.includes(issue.id);

  function handleSaveOrResolve() {
    if (!issue || isResolved) return;
    if (isSaved) {
      dispatch({ type: 'RESOLVE_ISSUE', issueId: issue.id });
    } else {
      dispatch({ type: 'SAVE_ISSUE', issueId: issue.id });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ResponsiveContainer>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
            <Text style={styles.backLabel}>{'< Back'}</Text>
          </TouchableOpacity>

          <Text style={styles.issueBadge}>{ISSUE_TYPE_LABELS[issue.issueType] ?? issue.issueType}</Text>
          <Text style={styles.title}>{issue.title}</Text>

          <View style={styles.explanationCard}>
            <Text style={styles.explanationText}>{issue.explanation}</Text>
          </View>

          <Text style={styles.sectionLabel}>What to do next</Text>
          {issue.steps.map((step) => (
            <View key={step.number} style={styles.stepRow}>
              <View style={styles.stepNumberBadge}>
                <Text style={styles.stepNumberText}>{step.number}</Text>
              </View>
              <Text style={styles.stepLabel}>{step.label}</Text>
            </View>
          ))}

          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Suggested script</Text>
          <Text style={styles.sectionSubtext}>Use this as a starting point when calling or visiting the office.</Text>
          <View style={styles.scriptBox}>
            <Text style={styles.scriptText}>{issue.contactScript}</Text>
          </View>

          {office && (
            <TouchableOpacity
              style={styles.contactButton}
              onPress={() =>
                router.push({
                  pathname: '/office/[officeId]',
                  params: { officeId: issue.officeId, reason: issue.title },
                })
              }
              accessibilityRole="button"
            >
              <Text style={styles.contactButtonText}>Contact {office.name}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.saveButton,
              isSaved && !isResolved && styles.resolveButton,
              isResolved && styles.resolvedButton,
            ]}
            onPress={handleSaveOrResolve}
            disabled={isResolved}
            accessibilityRole="button"
          >
            <Text
              style={[
                styles.saveButtonText,
                isSaved && !isResolved && styles.resolveButtonText,
                isResolved && styles.resolvedButtonText,
              ]}
            >
              {isResolved ? 'Marked as resolved' : isSaved ? 'Mark as Resolved' : 'Save This Plan'}
            </Text>
          </TouchableOpacity>

          {isSaved && !isResolved && (
            <Text style={styles.savedNote}>
              Saved — this issue stays flagged on your dashboard until you mark it resolved.
            </Text>
          )}
        </ResponsiveContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 40 },
  notFound: { fontSize: 15, color: '#666', marginTop: 20 },

  backButton: { marginTop: 12, marginBottom: 20, alignSelf: 'flex-start' },
  backLabel: { fontSize: 15, color: '#111', fontWeight: '500' },

  issueBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 16 },

  explanationCard: {
    borderWidth: 1,
    borderColor: '#111',
    padding: 16,
    marginBottom: 24,
  },
  explanationText: { fontSize: 15, color: '#222', lineHeight: 23 },

  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 6 },
  sectionSubtext: { fontSize: 13, color: '#888', marginBottom: 12 },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 8,
    gap: 14,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: { fontSize: 12, fontWeight: '700', color: '#fff' },
  stepLabel: { flex: 1, fontSize: 14, color: '#222', lineHeight: 21 },

  scriptBox: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#fafafa',
    padding: 16,
    marginBottom: 24,
  },
  scriptText: { fontSize: 14, color: '#333', lineHeight: 22, fontStyle: 'italic' },

  contactButton: {
    backgroundColor: '#111',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  contactButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },

  saveButton: {
    borderWidth: 1,
    borderColor: '#111',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButtonText: { fontSize: 15, fontWeight: '600', color: '#111' },

  resolveButton: { backgroundColor: '#111' },
  resolveButtonText: { color: '#fff' },

  resolvedButton: { borderColor: '#ccc', backgroundColor: '#fff' },
  resolvedButtonText: { color: '#999', fontWeight: '400' },

  savedNote: { fontSize: 12, color: '#888', textAlign: 'center' },
});
