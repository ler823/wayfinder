import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { differenceInDays, format, parseISO } from 'date-fns';
import { useDeadlines } from '@/context/DeadlinesContext';
import { OFFICE_CONTACTS } from '@/data/officeContacts';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import type { ChecklistStep } from '@/types/deadline';

const CATEGORY_LABELS: Record<string, string> = {
  'financial-aid': 'Financial Aid',
  'academic': 'Academic',
  'registration': 'Registration',
  'advising': 'Advising',
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

  return (
    <TouchableOpacity
      style={styles.stepRow}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: isDone }}
    >
      <View style={[styles.stepCheck, isDone && styles.stepCheckDone, isInProgress && styles.stepCheckInProgress]}>
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
            <Text style={styles.backLabel}>{'< Back'}</Text>
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
          {/* Back button */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
            <Text style={styles.backLabel}>{'< Back'}</Text>
          </TouchableOpacity>

          {/* Title + meta */}
          <Text style={styles.title}>{deadline.title}</Text>
          <Text style={[styles.dueLabel, isUrgent && styles.dueLabelUrgent]}>
            {dueLineLabel(days, formattedDate)}
          </Text>
          <Text style={styles.categoryLabel}>
            {CATEGORY_LABELS[deadline.category] ?? deadline.category}
          </Text>

          {/* Consequence — first and prominent */}
          <View style={[styles.consequenceCard, isUrgent && styles.consequenceCardUrgent]}>
            <Text style={styles.consequenceHeading}>What happens if you miss this</Text>
            <Text style={styles.consequenceText}>{deadline.consequence}</Text>
          </View>

          {/* Action checklist */}
          {deadline.steps.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>What you need to do</Text>
                {allDone && <Text style={styles.allDoneLabel}>All done</Text>}
              </View>
              {deadline.steps.map((step) => (
                <StepRow
                  key={step.id}
                  step={step}
                  onToggle={() => toggleStep(step.id, step.status)}
                />
              ))}
            </>
          )}

          {/* Office contact */}
          {office && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Need help?</Text>
              <View style={styles.officeCard}>
                <Text style={styles.officeName}>{office.name}</Text>
                <Text style={styles.officeHours}>{office.hours}</Text>
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={() => Linking.openURL(`tel:${office.phone.replace(/\D/g, '')}`)}
                  accessibilityRole="button"
                >
                  <Text style={styles.callButtonText}>Call {office.phone}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.emailButton}
                  onPress={() => Linking.openURL(`mailto:${office.email}`)}
                  accessibilityRole="button"
                >
                  <Text style={styles.emailButtonText}>Email {office.email}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.viewOfficeLink}
                  onPress={() =>
                    router.push({
                      pathname: '/office/[officeId]',
                      params: { officeId: office.id, reason: deadline.title },
                    })
                  }
                  accessibilityRole="button"
                >
                  <Text style={styles.viewOfficeLinkText}>View full contact info →</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Save and exit */}
          <TouchableOpacity style={styles.saveButton} onPress={saveProgress} accessibilityRole="button">
            <Text style={styles.saveButtonText}>Save and come back later</Text>
          </TouchableOpacity>
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

  title: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 6 },
  dueLabel: { fontSize: 14, color: '#666', marginBottom: 4 },
  dueLabelUrgent: { color: '#111', fontWeight: '700' },
  categoryLabel: { fontSize: 12, color: '#888', marginBottom: 20 },

  consequenceCard: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 16,
    marginBottom: 24,
  },
  consequenceCardUrgent: { borderColor: '#111' },
  consequenceHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111',
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  consequenceText: { fontSize: 15, color: '#333', lineHeight: 22 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#666' },
  allDoneLabel: { fontSize: 12, color: '#444', fontWeight: '600' },

  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  stepCheck: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepCheckDone: { borderColor: '#111', backgroundColor: '#111' },
  stepCheckInProgress: { borderColor: '#888', backgroundColor: '#eee' },
  stepCheckMark: { fontSize: 11, color: '#fff', fontWeight: '700' },
  stepLabel: { flex: 1, fontSize: 14, color: '#222', lineHeight: 20 },
  stepLabelDone: { color: '#999', textDecorationLine: 'line-through' },

  officeCard: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 16,
    marginBottom: 24,
  },
  officeName: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 4 },
  officeHours: { fontSize: 13, color: '#666', marginBottom: 16 },
  callButton: {
    backgroundColor: '#111',
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  callButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  emailButton: {
    borderWidth: 1,
    borderColor: '#111',
    paddingVertical: 14,
    alignItems: 'center',
  },
  emailButtonText: { color: '#111', fontSize: 15, fontWeight: '600' },

  saveButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonText: { fontSize: 15, color: '#666' },

  viewOfficeLink: { paddingTop: 12, alignItems: 'center' },
  viewOfficeLinkText: { fontSize: 13, color: '#555', fontWeight: '500' },
});
