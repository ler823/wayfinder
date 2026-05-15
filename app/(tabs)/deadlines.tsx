import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { differenceInDays, parseISO } from 'date-fns';
import { useDeadlines } from '@/context/DeadlinesContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Badge } from '@/components/ui/Badge';
import { colors, radius, typeScale } from '@/constants/colors';
import type { Deadline, DeadlineCategory } from '@/types/deadline';

const CATEGORY_LABELS: Record<DeadlineCategory, string> = {
  'financial-aid': 'Financial Aid',
  academic:        'Academic',
  registration:    'Registration',
  advising:        'Advising',
};

function daysLabel(dueDate: string): string {
  const days = differenceInDays(parseISO(dueDate), new Date());
  if (days < 0) return 'Overdue';
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  return `Due in ${days} days`;
}

function DeadlineCard({ deadline, onPress }: { deadline: Deadline; onPress: () => void }) {
  const days = differenceInDays(parseISO(deadline.dueDate), new Date());
  const isUrgent = days <= 7;
  const completedSteps = deadline.steps.filter((s) => s.status === 'done').length;
  const allDone = completedSteps === deadline.steps.length && deadline.steps.length > 0;

  const stepSummary = allDone
    ? 'All steps completed.'
    : `${completedSteps} of ${deadline.steps.length} steps completed.`;

  return (
    <TouchableOpacity
      style={[styles.card, isUrgent && styles.cardUrgent]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${isUrgent ? 'Urgent. ' : ''}${deadline.title}. ${daysLabel(deadline.dueDate)}. ${CATEGORY_LABELS[deadline.category]}. ${deadline.steps.length > 0 ? stepSummary : ''}`}
    >
      <View style={[styles.cardAccent, isUrgent && styles.cardAccentUrgent]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {deadline.title}
          </Text>
          <Text style={[styles.daysLabel, isUrgent && styles.daysLabelUrgent]}>
            {daysLabel(deadline.dueDate)}
          </Text>
        </View>
        <View style={styles.cardBottom}>
          <Badge category={deadline.category} label={CATEGORY_LABELS[deadline.category]} />
          {deadline.steps.length > 0 && (
            <Text style={styles.stepsLabel}>
              {allDone ? 'All steps done ✓' : `${completedSteps} / ${deadline.steps.length} steps`}
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.chevron}>{'›'}</Text>
    </TouchableOpacity>
  );
}

export default function DeadlinesScreen() {
  const { state } = useDeadlines();
  const router = useRouter();

  const sorted = [...state.deadlines].sort(
    (a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime(),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ResponsiveContainer>
          <Text style={styles.heading}>Deadlines</Text>
          <Text style={styles.subheading}>Tap a deadline to see what you need to do.</Text>
          {sorted.map((d) => (
            <DeadlineCard
              key={d.id}
              deadline={d}
              onPress={() => router.push({ pathname: '/deadline/[id]', params: { id: d.id } })}
            />
          ))}
        </ResponsiveContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 32 },
  heading: { fontSize: typeScale.xl, fontWeight: '700', color: colors.text.primary, marginTop: 20, marginBottom: 4 },
  subheading: { fontSize: typeScale.sm + 1, color: colors.text.secondary, marginBottom: 24 },

  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  cardUrgent: { borderColor: colors.urgent },
  cardAccent: { width: 4, backgroundColor: colors.border, alignSelf: 'stretch' },
  cardAccentUrgent: { backgroundColor: colors.urgent },
  cardBody: { flex: 1, padding: 14 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: { flex: 1, fontSize: typeScale.base, fontWeight: '600', color: colors.text.primary },
  daysLabel: { fontSize: typeScale.xs + 1, color: colors.text.secondary, fontWeight: '500', flexShrink: 0 },
  daysLabelUrgent: { color: colors.urgent, fontWeight: '700' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepsLabel: { fontSize: typeScale.xs + 1, color: colors.text.tertiary },
  chevron: { paddingHorizontal: 14, fontSize: 18, color: colors.text.tertiary },
});
