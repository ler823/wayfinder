import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ACADEMIC_ISSUES } from '@/data/academicIssues';
import { OFFICE_CONTACTS } from '@/data/officeContacts';
import { useAcademicRecovery } from '@/context/AcademicRecoveryContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { colors, radius, typeScale } from '@/constants/colors';

const ISSUE_TYPE_LABELS: Record<string, string> = {
  probation:            'Academic Standing',
  'transfer-credit-gap': 'Transfer Credits',
  'course-failure':     'Course Grade',
  'sap-warning':        'Financial Aid',
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
            <Text style={styles.backLabel}>{'‹ Back'}</Text>
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
            <Text style={styles.backLabel}>{'‹ Back'}</Text>
          </TouchableOpacity>

          <Text style={styles.issueBadge}>{ISSUE_TYPE_LABELS[issue.issueType] ?? issue.issueType}</Text>
          <Text style={styles.title}>{issue.title}</Text>

          <Card variant="urgent" style={styles.explanationGap}>
            <View style={styles.explanationInner}>
              <Text style={styles.explanationText}>{issue.explanation}</Text>
            </View>
          </Card>

          <SectionLabel>What to do next</SectionLabel>
          <View style={styles.stepList}>
            {issue.steps.map((step) => (
              <View key={step.number} style={styles.stepRow}>
                <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>{step.number}</Text>
                </View>
                <Text style={styles.stepLabel}>{step.label}</Text>
              </View>
            ))}
          </View>

          <SectionLabel style={styles.scriptLabel}>Suggested script</SectionLabel>
          <Text style={styles.sectionSubtext}>
            Use this as a starting point when calling or visiting the office.
          </Text>
          <Card variant="info" style={styles.scriptGap}>
            <View style={styles.scriptInner}>
              <Text style={styles.scriptText}>{issue.contactScript}</Text>
            </View>
          </Card>

          {office && (
            <Button
              label={`Contact ${office.name}`}
              onPress={() =>
                router.push({
                  pathname: '/office/[officeId]',
                  params: { officeId: issue.officeId, reason: issue.title },
                })
              }
              style={styles.contactGap}
            />
          )}

          <Button
            label={
              isResolved ? 'Marked as resolved' : isSaved ? 'Mark as Resolved' : 'Save This Plan'
            }
            onPress={handleSaveOrResolve}
            variant={isSaved && !isResolved ? 'primary' : 'secondary'}
            disabled={isResolved}
            style={styles.saveGap}
          />

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
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },
  notFound: { fontSize: typeScale.base, color: colors.text.secondary, marginTop: 20 },

  backButton: { marginTop: 12, marginBottom: 20, alignSelf: 'flex-start' },
  backLabel: { fontSize: typeScale.base, color: colors.navy, fontWeight: '500' },

  issueBadge: {
    fontSize: typeScale.xs,
    fontWeight: '700',
    color: colors.urgent,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: { fontSize: typeScale.xl, fontWeight: '700', color: colors.text.primary, marginBottom: 16 },

  explanationGap: { marginBottom: 24 },
  explanationInner: { padding: 16 },
  explanationText: { fontSize: typeScale.base, color: colors.text.primary, lineHeight: 23 },

  stepList: { gap: 8, marginBottom: 24 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    gap: 14,
    backgroundColor: colors.surface,
  },
  stepNumberBadge: {
    width: 22,
    height: 22,
    backgroundColor: colors.navy,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: { fontSize: typeScale.xs + 1, fontWeight: '700', color: colors.text.inverse },
  stepLabel: { flex: 1, fontSize: typeScale.sm + 1, color: colors.text.primary, lineHeight: 21 },

  scriptLabel: { marginTop: 24 },
  sectionSubtext: { fontSize: typeScale.sm, color: colors.text.tertiary, marginBottom: 12 },
  scriptGap: { marginBottom: 24 },
  scriptInner: { padding: 16 },
  scriptText: { fontSize: typeScale.sm + 1, color: colors.text.primary, lineHeight: 22, fontStyle: 'italic' },

  contactGap: { marginBottom: 12 },
  saveGap: { marginBottom: 8 },
  savedNote: { fontSize: typeScale.xs + 1, color: colors.text.tertiary, textAlign: 'center' },
});
