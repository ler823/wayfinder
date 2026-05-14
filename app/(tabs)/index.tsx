import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStudentProfile } from '@/context/StudentProfileContext';
import { useDeadlines } from '@/context/DeadlinesContext';
import { differenceInDays, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

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
              <Text style={styles.chevron}>{'>'}</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionLabel}>This Week's Tasks (3)</Text>

          {[
            'Review Spring Registration Dates',
            'Check Advising Availability',
            'Confirm Financial Aid Documents',
          ].map((task) => (
            <View key={task} style={styles.taskRow}>
              <View style={styles.checkbox} />
              <Text style={styles.taskLabel}>{task}</Text>
              <Text style={styles.chevron}>{'>'}</Text>
            </View>
          ))}

          <Text style={styles.sectionLabel}>Degree Progress</Text>
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

          <Text style={styles.sectionLabel}>Recent Alerts</Text>
          <TouchableOpacity
            style={styles.alertRow}
            onPress={() => router.push('/recovery/probation')}
            accessibilityRole="button"
          >
            <Text style={styles.alertText}>Alert — Academic standing update available</Text>
            <Text style={styles.chevron}>{'>'}</Text>
          </TouchableOpacity>
        </ResponsiveContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 32 },
  greeting: { fontSize: 20, fontWeight: '700', color: '#111', marginTop: 20 },
  subGreeting: { fontSize: 14, color: '#666', marginBottom: 24, marginTop: 2 },

  urgentCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#111',
    marginBottom: 24,
    alignItems: 'center',
    paddingRight: 14,
  },
  urgentAccent: { width: 5, backgroundColor: '#111', alignSelf: 'stretch' },
  urgentBody: { flex: 1, padding: 14 },
  urgentLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  urgentTitle: { fontSize: 15, fontWeight: '600', color: '#111', marginBottom: 4 },
  urgentMeta: { fontSize: 13, color: '#555' },

  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 10, marginTop: 4 },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  checkbox: { width: 18, height: 18, borderWidth: 1.5, borderColor: '#888' },
  taskLabel: { flex: 1, fontSize: 14, color: '#222' },

  progressCard: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 24,
  },
  progressBarTrack: {
    height: 28,
    backgroundColor: '#eee',
    marginBottom: 8,
    justifyContent: 'center',
    position: 'relative',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#111',
    position: 'absolute',
    left: 0,
  },
  progressPercent: {
    position: 'absolute',
    alignSelf: 'center',
    width: '100%',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '700',
    color: '#fff',
  },
  progressMeta: { fontSize: 13, color: '#555' },

  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 8,
  },
  alertText: { flex: 1, fontSize: 14, color: '#222' },
  chevron: { fontSize: 14, color: '#999' },
});
