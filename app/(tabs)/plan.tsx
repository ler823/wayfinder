import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { format, parseISO } from 'date-fns';
import { useSemesterPlan } from '@/context/SemesterPlanContext';
import { useStudentProfile } from '@/context/StudentProfileContext';
import { useAcademicRecovery } from '@/context/AcademicRecoveryContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SEED_COURSES, COMPLETED_COURSE_IDS } from '@/data/degreeRequirements';
import { colors, radius, typeScale } from '@/constants/colors';
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
          <Text style={styles.warningHeading}>CHECK PREREQUISITES FIRST</Text>
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
              <Text style={styles.transferBannerChevron}>{'›'}</Text>
            </TouchableOpacity>
          )}

          <ProgressBar
            completed={profile.unitsCompleted}
            required={profile.unitsRequired}
          />

          <SectionLabel>Plan Next Semester</SectionLabel>
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
                <SectionLabel style={{ marginBottom: 0 }}>Your Tentative Plan</SectionLabel>
                <Text style={styles.unitTotal}>{totalPlannedUnits} units</Text>
              </View>
              {plan.courses.map((course) => (
                <PlannedCourseRow
                  key={course.id}
                  course={course}
                  onRemove={() => dispatch({ type: 'REMOVE_COURSE', courseId: course.id })}
                />
              ))}
              <Button
                label="Save Tentative Plan"
                onPress={savePlan}
                style={styles.saveButtonGap}
              />
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
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },
  heading: { fontSize: typeScale.xl, fontWeight: '700', color: colors.text.primary, marginTop: 20, marginBottom: 4 },
  subheading: { fontSize: typeScale.sm + 1, color: colors.text.secondary, marginBottom: 24 },

  progressSection: { marginBottom: 28 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: typeScale.sm, fontWeight: '600', color: colors.text.secondary },
  progressCount: { fontSize: typeScale.sm, color: colors.text.secondary },
  progressTrack: { height: 8, backgroundColor: '#E8E4E0', borderRadius: radius.sm, overflow: 'hidden' },
  progressFill: { height: 8, backgroundColor: colors.navy },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 10,
  },
  unitTotal: { fontSize: typeScale.sm, fontWeight: '700', color: colors.text.primary },

  courseRow: {
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
  courseRowWarning: { borderColor: colors.urgent },
  courseInfo: { flex: 1 },
  courseName: { fontSize: typeScale.sm + 1, fontWeight: '600', color: colors.text.primary, marginBottom: 2 },
  courseMeta: { fontSize: typeScale.xs + 1, color: colors.text.tertiary },
  prereqNote: { fontSize: typeScale.xs + 1, color: colors.urgent, marginTop: 4 },

  addButton: {
    borderWidth: 1.5,
    borderColor: colors.navy,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexShrink: 0,
  },
  addButtonText: { fontSize: typeScale.sm, fontWeight: '600', color: colors.navy },

  plannedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 14,
    marginBottom: 0,
    gap: 12,
    backgroundColor: colors.surface,
  },
  removeButton: { paddingHorizontal: 12, paddingVertical: 8, flexShrink: 0 },
  removeButtonText: { fontSize: 22, color: colors.text.tertiary, lineHeight: 24 },

  warningCard: {
    borderWidth: 1,
    borderColor: colors.urgent,
    borderTopWidth: 0,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    padding: 14,
    marginBottom: 8,
    backgroundColor: '#FDF1EE',
  },
  warningHeading: {
    fontSize: typeScale.xs,
    fontWeight: '700',
    color: colors.urgent,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  warningText: { fontSize: typeScale.sm, color: colors.text.primary, lineHeight: 19 },

  saveButtonGap: { marginTop: 16 },
  savedAt: { fontSize: typeScale.xs + 1, color: colors.text.tertiary, textAlign: 'center', marginTop: 8 },

  emptyText: { fontSize: typeScale.sm + 1, color: colors.text.tertiary, marginBottom: 16 },

  transferBanner: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: colors.urgent,
    borderRadius: radius.lg,
    marginBottom: 20,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  transferBannerAccent: { width: 5, backgroundColor: colors.urgent, alignSelf: 'stretch' },
  transferBannerBody: { flex: 1, padding: 14 },
  transferBannerLabel: {
    fontSize: typeScale.xs,
    fontWeight: '700',
    color: colors.urgent,
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  transferBannerText: { fontSize: typeScale.sm, color: colors.text.primary, lineHeight: 19 },
  transferBannerChevron: { fontSize: 18, color: colors.text.tertiary, paddingHorizontal: 14 },
});
