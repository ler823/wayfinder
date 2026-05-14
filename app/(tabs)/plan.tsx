import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { useSemesterPlan } from '@/context/SemesterPlanContext';
import { useStudentProfile } from '@/context/StudentProfileContext';
import { useAcademicRecovery } from '@/context/AcademicRecoveryContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { SEED_COURSES, COMPLETED_COURSE_IDS } from '@/data/degreeRequirements';
import type { Course, PlannedCourse } from '@/types/course';

const COURSE_NAME: Record<string, string> = Object.fromEntries(
  SEED_COURSES.map((c) => [c.id, c.name]),
);

function ProgressBar({ completed, required }: { completed: number; required: number }) {
  const pct = required > 0 ? Math.min(completed / required, 1) : 0;
  return (
    <View style={styles.progressSection}>
      <View style={styles.progressLabelRow}>
        <Text style={styles.progressLabel}>Degree Progress</Text>
        <Text style={styles.progressCount}>
          {completed} / {required} units
        </Text>
      </View>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${pct * 100}%` as any }]} />
      </View>
    </View>
  );
}

function CourseRow({
  course,
  hasWarning,
  onAdd,
}: {
  course: Course;
  hasWarning: boolean;
  onAdd: () => void;
}) {
  return (
    <View style={[styles.courseRow, hasWarning && styles.courseRowWarning]}>
      <View style={styles.courseInfo}>
        <Text style={styles.courseName}>{course.name}</Text>
        <Text style={styles.courseMeta}>
          {course.units} units · {course.requirementCategory}
        </Text>
        {hasWarning && (
          <Text style={styles.prereqNote}>
            Requires:{' '}
            {course.prerequisites
              .filter((p) => !COMPLETED_COURSE_IDS.includes(p))
              .map((p) => COURSE_NAME[p] ?? p)
              .join(', ')}
          </Text>
        )}
      </View>
      <TouchableOpacity onPress={onAdd} style={styles.addButton} accessibilityRole="button">
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );
}

function PlannedCourseRow({
  course,
  onRemove,
}: {
  course: PlannedCourse;
  onRemove: () => void;
}) {
  return (
    <>
      <View style={styles.plannedRow}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseName}>{course.name}</Text>
          <Text style={styles.courseMeta}>
            {course.units} units · {course.requirementCategory}
          </Text>
        </View>
        <TouchableOpacity onPress={onRemove} style={styles.removeButton} accessibilityRole="button">
          <Text style={styles.removeButtonText}>×</Text>
        </TouchableOpacity>
      </View>
      {course.hasPrerequisiteWarning && (
        <View style={styles.warningCard}>
          <Text style={styles.warningHeading}>Check prerequisites first</Text>
          <Text style={styles.warningText}>
            You may not have completed all prerequisites for{' '}
            <Text style={{ fontWeight: '600' }}>{course.name}</Text>. Enrolling without them can
            put you behind. Talk to your advisor before adding this to your schedule.
          </Text>
        </View>
      )}
    </>
  );
}

export default function PlanScreen() {
  const { plan, dispatch } = useSemesterPlan();
  const { profile } = useStudentProfile();
  const { state: recoveryState } = useAcademicRecovery();
  const router = useRouter();

  const transferCreditFlagged = recoveryState.savedIssueIds.includes('transfer-credit-gap');

  const plannedIds = new Set(plan.courses.map((c) => c.id));
  const availableCourses = SEED_COURSES.filter(
    (c) => !COMPLETED_COURSE_IDS.includes(c.id) && !plannedIds.has(c.id),
  );

  const totalPlannedUnits = plan.courses.reduce((sum, c) => sum + c.units, 0);

  function addCourse(course: Course) {
    dispatch({ type: 'ADD_COURSE', course: { ...course, hasPrerequisiteWarning: false } });
  }

  function savePlan() {
    dispatch({ type: 'SAVE_PLAN' });
    Alert.alert(
      'Plan Saved',
      'Would you like to prepare for your advising appointment?',
      [
        { text: 'Not yet', style: 'cancel' },
        { text: 'Go to Advising', onPress: () => router.push('/(tabs)/advising') },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ResponsiveContainer>
          <Text style={styles.heading}>Plan</Text>
          <Text style={styles.subheading}>
            Map out your next semester and track your degree progress.
          </Text>

          {transferCreditFlagged && (
            <TouchableOpacity
              style={styles.transferBanner}
              onPress={() => router.push('/recovery/transfer-credit-gap')}
              accessibilityRole="button"
            >
              <View style={styles.transferBannerAccent} />
              <View style={styles.transferBannerBody}>
                <Text style={styles.transferBannerLabel}>TRANSFER CREDITS UNDER REVIEW</Text>
                <Text style={styles.transferBannerText}>
                  Some credits may not be applied yet — your unit count could change.
                </Text>
              </View>
              <Text style={styles.transferBannerChevron}>{'>'}</Text>
            </TouchableOpacity>
          )}

          <ProgressBar
            completed={profile.unitsCompleted}
            required={profile.unitsRequired}
          />

          <Text style={styles.sectionLabel}>Plan Next Semester</Text>
          {availableCourses.length === 0 ? (
            <Text style={styles.emptyText}>You've added all available courses.</Text>
          ) : (
            availableCourses.map((course) => {
              const hasWarning = course.prerequisites.some(
                (p) => !COMPLETED_COURSE_IDS.includes(p),
              );
              return (
                <CourseRow
                  key={course.id}
                  course={course}
                  hasWarning={hasWarning}
                  onAdd={() => addCourse(course)}
                />
              );
            })
          )}

          {plan.courses.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionLabel}>Your Tentative Plan</Text>
                <Text style={styles.unitTotal}>{totalPlannedUnits} units</Text>
              </View>
              {plan.courses.map((course) => (
                <PlannedCourseRow
                  key={course.id}
                  course={course}
                  onRemove={() => dispatch({ type: 'REMOVE_COURSE', courseId: course.id })}
                />
              ))}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={savePlan}
                accessibilityRole="button"
              >
                <Text style={styles.saveButtonText}>Save Tentative Plan</Text>
              </TouchableOpacity>
              {plan.savedAt && (
                <Text style={styles.savedAt}>
                  Last saved {format(parseISO(plan.savedAt), 'MMMM d, yyyy')}
                </Text>
              )}
            </>
          )}
        </ResponsiveContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '700', color: '#111', marginTop: 20, marginBottom: 4 },
  subheading: { fontSize: 14, color: '#666', marginBottom: 24 },

  progressSection: { marginBottom: 28 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 13, fontWeight: '600', color: '#666' },
  progressCount: { fontSize: 13, color: '#666' },
  progressTrack: { height: 8, backgroundColor: '#e5e5e5' },
  progressFill: { height: 8, backgroundColor: '#111' },

  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 10 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
  },
  unitTotal: { fontSize: 13, fontWeight: '700', color: '#111' },

  courseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  courseRowWarning: { borderColor: '#bbb' },
  courseInfo: { flex: 1 },
  courseName: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 2 },
  courseMeta: { fontSize: 12, color: '#888' },
  prereqNote: { fontSize: 12, color: '#555', marginTop: 4 },

  addButton: {
    borderWidth: 1,
    borderColor: '#111',
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexShrink: 0,
  },
  addButtonText: { fontSize: 13, fontWeight: '600', color: '#111' },

  plannedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 0,
    gap: 12,
  },
  removeButton: { paddingHorizontal: 12, paddingVertical: 8, flexShrink: 0 },
  removeButtonText: { fontSize: 22, color: '#999', lineHeight: 24 },

  warningCard: {
    borderWidth: 1,
    borderColor: '#111',
    borderTopWidth: 0,
    padding: 14,
    marginBottom: 8,
  },
  warningHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  warningText: { fontSize: 13, color: '#333', lineHeight: 19 },

  saveButton: {
    backgroundColor: '#111',
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  savedAt: { fontSize: 12, color: '#999', textAlign: 'center', marginTop: 8 },

  emptyText: { fontSize: 14, color: '#888', marginBottom: 16 },

  transferBanner: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#111',
    marginBottom: 20,
    alignItems: 'center',
  },
  transferBannerAccent: { width: 5, backgroundColor: '#111', alignSelf: 'stretch' },
  transferBannerBody: { flex: 1, padding: 14 },
  transferBannerLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#111',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  transferBannerText: { fontSize: 13, color: '#333', lineHeight: 19 },
  transferBannerChevron: { fontSize: 14, color: '#999', paddingHorizontal: 14 },
});
