import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { differenceInDays, format, parseISO } from 'date-fns';
import { useDeadlines } from '@/context/DeadlinesContext';
import { OFFICE_CONTACTS } from '@/data/officeContacts';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { colors, radius, typeScale } from '@/constants/colors';
import type { ChecklistStep, DeadlineCategory } from '@/types/deadline';

const CATEGORY_LABELS: Record<DeadlineCategory, string> = {
  'financial-aid': 'Financial Aid',
  academic:        'Academic',
  registration:    'Registration',
  advising:        'Advising',
};

function dueLineLabel(days: number, formattedDate: string): string {
  if (days < 0) return `Overdue — was due ${formattedDate}`;
  if (days === 0) return `Due today — ${formattedDate}`;
  if (days === 1) return `Due tomorrow — ${formattedDate}`;
  return `Due in ${days} days — ${formattedDate}`;
}

function StepRow({ step, onToggle }: { step: ChecklistStep; onToggle: () => void }) {
  const isDone = step.status === 'done';
  const isInProgress = step.status === 'in-progress';

  const statusLabel = isDone ? 'Completed' : isInProgress ? 'In progress' : 'Not started';

  return (
    <TouchableOpacity
      style={styles.stepRow}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isDone }}
      accessibilityLabel={`${step.label}. ${statusLabel}. Tap to toggle.`}
    >
      <View
        style={[
          styles.stepCheck,
          isDone && styles.stepCheckDone,
          isInProgress && styles.stepCheckInProgress,
        ]}
      >
        {isDone && <Text style={styles.stepCheckMark}>✓</Text>}
        {isInProgress && <Text style={styles.stepCheckMark}>–</Text>}
      </View>
      <Text style={[styles.stepLabel, isDone && styles.stepLabelDone]}>{step.label}</Text>
    </TouchableOpacity>
  );
}

export default function DeadlineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useDeadlines();
  const router = useRouter();

  const deadline = state.deadlines.find((d) => d.id === id);

  if (!deadline) {
    return (
      <SafeAreaView style={styles.container}>
        <ResponsiveContainer>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backLabel}>{'‹ Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.notFound}>Deadline not found.</Text>
        </ResponsiveContainer>
      </SafeAreaView>
    );
  }

  const office = OFFICE_CONTACTS.find((o) => o.id === deadline.officeId);
  const days = differenceInDays(parseISO(deadline.dueDate), new Date());
  const formattedDate = format(parseISO(deadline.dueDate), 'MMMM d, yyyy');
  const isUrgent = days <= 7;

  function toggleStep(stepId: string, currentStatus: ChecklistStep['status']) {
    if (!deadline) return;
    const next: ChecklistStep['status'] = currentStatus === 'done' ? 'pending' : 'done';
    dispatch({ type: 'SET_STEP_STATUS', deadlineId: deadline.id, stepId, status: next });
  }

  function saveProgress() {
    if (!deadline) return;
    dispatch({ type: 'SAVE_PROGRESS', deadlineId: deadline.id });
    router.back();
  }

  const completedCount = deadline.steps.filter((s) => s.status === 'done').length;
  const allDone = completedCount === deadline.steps.length && deadline.steps.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ResponsiveContainer>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back to deadlines list">
            <Text style={styles.backLabel}>{'‹ Back'}</Text>
          </TouchableOpacity>

          <Text style={styles.title}>{deadline.title}</Text>
          <Text style={[styles.dueLabel, isUrgent && styles.dueLabelUrgent]}>
            {dueLineLabel(days, formattedDate)}
          </Text>
          <View style={styles.badgeRow}>
            <Badge category={deadline.category} label={CATEGORY_LABELS[deadline.category]} />
          </View>

          <Card variant={isUrgent ? 'urgent' : 'default'} style={styles.consequenceGap}>
            <View style={styles.consequenceInner}>
              <Text style={styles.consequenceHeading}>WHAT HAPPENS IF YOU MISS THIS</Text>
              <Text style={styles.consequenceText}>{deadline.consequence}</Text>
            </View>
          </Card>

          {deadline.steps.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <SectionLabel style={{ marginBottom: 0 }}>What you need to do</SectionLabel>
                {allDone && <Text style={styles.allDoneLabel}>All done ✓</Text>}
              </View>
              <View style={styles.stepList}>
                {deadline.steps.map((step) => (
                  <StepRow
                    key={step.id}
                    step={step}
                    onToggle={() => toggleStep(step.id, step.status)}
                  />
                ))}
              </View>
            </>
          )}

          {office && (
            <>
              <SectionLabel style={styles.needHelpLabel}>Need help?</SectionLabel>
              <Card style={styles.officeCardGap}>
                <View style={styles.officeCardInner}>
                  <Text style={styles.officeName}>{office.name}</Text>
                  <Text style={styles.officeHours}>{office.hours}</Text>
                  <Button
                    label={`Call ${office.phone}`}
                    onPress={() => Linking.openURL(`tel:${office.phone.replace(/\D/g, '')}`)}
                    style={styles.callGap}
                  />
                  <Button
                    label={`Email ${office.email}`}
                    onPress={() => Linking.openURL(`mailto:${office.email}`)}
                    variant="secondary"
                    style={styles.emailGap}
                  />
                  <Button
                    label="View full contact info →"
                    onPress={() =>
                      router.push({
                        pathname: '/office/[officeId]',
                        params: { officeId: office.id, reason: deadline.title },
                      })
                    }
                    variant="ghost"
                  />
                </View>
              </Card>
            </>
          )}

          <Button
            label="Save and come back later"
            onPress={saveProgress}
            variant="secondary"
            style={styles.saveGap}
          />
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

  title: { fontSize: typeScale.xl, fontWeight: '700', color: colors.text.primary, marginBottom: 6 },
  dueLabel: { fontSize: typeScale.sm + 1, color: colors.text.secondary, marginBottom: 8 },
  dueLabelUrgent: { color: colors.urgent, fontWeight: '700' },
  badgeRow: { marginBottom: 20 },

  consequenceGap: { marginBottom: 24 },
  consequenceInner: { padding: 16 },
  consequenceHeading: {
    fontSize: typeScale.xs,
    fontWeight: '700',
    color: colors.text.secondary,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  consequenceText: { fontSize: typeScale.base, color: colors.text.primary, lineHeight: 22 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  allDoneLabel: { fontSize: typeScale.xs + 1, color: colors.success, fontWeight: '600' },

  stepList: { gap: 8, marginBottom: 24 },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    gap: 12,
    backgroundColor: colors.surface,
  },
  stepCheck: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: colors.text.tertiary,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepCheckDone: { borderColor: colors.success, backgroundColor: colors.success },
  stepCheckInProgress: { borderColor: colors.text.tertiary, backgroundColor: '#E8E4E0' },
  stepCheckMark: { fontSize: 11, color: colors.text.inverse, fontWeight: '700' },
  stepLabel: { flex: 1, fontSize: typeScale.sm + 1, color: colors.text.primary, lineHeight: 20 },
  stepLabelDone: { color: colors.text.tertiary, textDecorationLine: 'line-through' },

  needHelpLabel: { marginTop: 24 },
  officeCardGap: { marginBottom: 24 },
  officeCardInner: { padding: 16 },
  officeName: { fontSize: typeScale.base, fontWeight: '600', color: colors.text.primary, marginBottom: 4 },
  officeHours: { fontSize: typeScale.sm, color: colors.text.secondary, marginBottom: 16 },
  callGap: { marginBottom: 8 },
  emailGap: { marginBottom: 4 },

  saveGap: {},
});
