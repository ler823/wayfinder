import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudentProfile } from '@/context/StudentProfileContext';
import { useDeadlines } from '@/context/DeadlinesContext';
import { differenceInDays, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { colors, radius, typeScale } from '@/constants/colors';

export default function HomeScreen() {
  const { profile } = useStudentProfile();
  const { state } = useDeadlines();
  const router = useRouter();

  const urgentDeadline = state.deadlines
    .filter((d) => differenceInDays(parseISO(d.dueDate), new Date()) <= 7)
    .sort((a, b) => parseISO(a.dueDate).getTime() - parseISO(b.dueDate).getTime())[0];

  const daysUntil = urgentDeadline
    ? differenceInDays(parseISO(urgentDeadline.dueDate), new Date())
    : null;

  const greeting = `Good morning${profile.name ? `, ${profile.name}` : ''}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ResponsiveContainer>
          <Text style={styles.greeting}>{greeting}</Text>
          <Text style={styles.subGreeting}>Here's what needs your attention today.</Text>

          {urgentDeadline && (
            <TouchableOpacity
              style={styles.urgentCard}
              onPress={() => router.push('/(tabs)/deadlines')}
              accessibilityRole="button"
            >
              <View style={styles.urgentAccent} />
              <View style={styles.urgentBody}>
                <Text style={styles.urgentLabel}>URGENT</Text>
                <Text style={styles.urgentTitle}>{urgentDeadline.title}</Text>
                <Text style={styles.urgentMeta}>
                  Due in{' '}
                  {daysUntil === 0 ? 'today' : `${daysUntil} day${daysUntil === 1 ? '' : 's'}`} — tap
                  to view
                </Text>
              </View>
              <Text style={styles.chevron}>{'›'}</Text>
            </TouchableOpacity>
          )}

          <SectionLabel style={styles.sectionGap}>This Week's Tasks (3)</SectionLabel>

          {[
            'Review Spring Registration Dates',
            'Check Advising Availability',
            'Confirm Financial Aid Documents',
          ].map((task) => (
            <View key={task} style={styles.taskRow}>
              <View style={styles.checkbox} />
              <Text style={styles.taskLabel}>{task}</Text>
              <Text style={styles.chevron}>{'›'}</Text>
            </View>
          ))}

          <SectionLabel style={styles.sectionGap}>Degree Progress</SectionLabel>
          <View style={styles.progressCard}>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.round(
                      (profile.unitsCompleted / profile.unitsRequired) * 100,
                    )}%`,
                  },
                ]}
              />
              <Text style={styles.progressPercent}>
                {Math.round((profile.unitsCompleted / profile.unitsRequired) * 100)}%
              </Text>
            </View>
            <Text style={styles.progressMeta}>
              {profile.unitsCompleted} of {profile.unitsRequired} units completed —{' '}
              {profile.standing}, {profile.major || 'Undecided'}
            </Text>
          </View>

          <SectionLabel style={styles.sectionGap}>Recent Alerts</SectionLabel>
          <TouchableOpacity
            style={styles.alertRow}
            onPress={() => router.push('/recovery/probation')}
            accessibilityRole="button"
          >
            <Text style={styles.alertText}>Alert — Academic standing update available</Text>
            <Text style={styles.chevron}>{'›'}</Text>
          </TouchableOpacity>
        </ResponsiveContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 32 },
  greeting: { fontSize: typeScale.lg, fontWeight: '700', color: colors.text.primary, marginTop: 20 },
  subGreeting: { fontSize: typeScale.sm, color: colors.text.secondary, marginBottom: 24, marginTop: 2 },

  urgentCard: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors.urgent,
    borderRadius: radius.lg,
    marginBottom: 24,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  urgentAccent: { width: 5, backgroundColor: colors.urgent, alignSelf: 'stretch' },
  urgentBody: { flex: 1, padding: 14 },
  urgentLabel: {
    fontSize: typeScale.xs,
    fontWeight: '700',
    color: colors.urgent,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  urgentTitle: { fontSize: typeScale.base, fontWeight: '600', color: colors.text.primary, marginBottom: 4 },
  urgentMeta: { fontSize: typeScale.sm, color: colors.text.secondary },

  sectionGap: { marginTop: 4 },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    backgroundColor: colors.surface,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderColor: colors.text.tertiary,
    borderRadius: radius.sm,
  },
  taskLabel: { flex: 1, fontSize: typeScale.sm + 1, color: colors.text.primary },

  progressCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 24,
    backgroundColor: colors.surface,
  },
  progressBarTrack: {
    height: 28,
    backgroundColor: '#E8E4E0',
    borderRadius: radius.sm,
    marginBottom: 8,
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.navy,
    position: 'absolute',
    left: 0,
  },
  progressPercent: {
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
    fontSize: typeScale.sm,
    fontWeight: '700',
    color: colors.text.inverse,
  },
  progressMeta: { fontSize: typeScale.sm, color: colors.text.secondary },

  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  alertText: { flex: 1, fontSize: typeScale.sm + 1, color: colors.text.primary },
  chevron: { fontSize: 18, color: colors.text.tertiary },
});
