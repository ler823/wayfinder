import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { differenceInDays, parseISO } from 'date-fns';
import { useDeadlines } from '@/context/DeadlinesContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import type { Deadline } from '@/types/deadline';

const CATEGORY_LABELS: Record<string, string> = {
  'financial-aid': 'Financial Aid',
  'academic': 'Academic',
  'registration': 'Registration',
  'advising': 'Advising',
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

  return (
    <TouchableOpacity
      style={[styles.card, isUrgent && styles.cardUrgent]}
      onPress={onPress}
      accessibilityRole="button"
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
          <Text style={styles.categoryLabel}>
            {CATEGORY_LABELS[deadline.category] ?? deadline.category}
          </Text>
          {deadline.steps.length > 0 && (
            <Text style={styles.stepsLabel}>
              {allDone ? 'All steps done' : `${completedSteps} of ${deadline.steps.length} steps done`}
            </Text>
          )}
        </View>
      </View>
      <Text style={styles.chevron}>{'>'}</Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 32 },
  heading: { fontSize: 22, fontWeight: '700', color: '#111', marginTop: 20, marginBottom: 4 },
  subheading: { fontSize: 14, color: '#666', marginBottom: 24 },

  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 12,
    alignItems: 'center',
  },
  cardUrgent: { borderColor: '#111' },
  cardAccent: { width: 4, backgroundColor: '#e5e5e5', alignSelf: 'stretch' },
  cardAccentUrgent: { backgroundColor: '#111' },
  cardBody: { flex: 1, padding: 14 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
    gap: 8,
  },
  cardTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111' },
  daysLabel: { fontSize: 12, color: '#666', fontWeight: '500', flexShrink: 0 },
  daysLabelUrgent: { color: '#111', fontWeight: '700' },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between' },
  categoryLabel: { fontSize: 12, color: '#888' },
  stepsLabel: { fontSize: 12, color: '#888' },
  chevron: { paddingHorizontal: 14, fontSize: 14, color: '#999' },
});
