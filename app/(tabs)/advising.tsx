import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useAdvising } from '@/context/AdvisingContext';
import { useStudentProfile } from '@/context/StudentProfileContext';
import { useSemesterPlan } from '@/context/SemesterPlanContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { OFFICE_CONTACTS } from '@/data/officeContacts';
import { colors, radius, typeScale } from '@/constants/colors';
import type { AdvisingTopic, PrepSheetItem, FollowUpTask } from '@/types/advising';

const advisingOffice = OFFICE_CONTACTS.find((o) => o.id === 'advising')!;

function TopicRow({
  topic,
  onToggle,
  onRemove,
}: {
  topic: AdvisingTopic;
  onToggle: () => void;
  onRemove?: () => void;
}) {
  return (
    <View style={styles.topicRow}>
      <TouchableOpacity
        style={styles.topicCheckArea}
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: topic.checked }}
      >
        <View style={[styles.check, topic.checked && styles.checkDone]}>
          {topic.checked && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <View style={styles.topicBody}>
          <Text style={[styles.topicLabel, !topic.checked && styles.topicLabelUnchecked]}>
            {topic.label}
          </Text>
          <Text style={styles.topicReason}>{topic.reason}</Text>
        </View>
      </TouchableOpacity>
      {onRemove && (
        <TouchableOpacity onPress={onRemove} style={styles.removeTopicButton} accessibilityRole="button">
          <Text style={styles.removeTopicText}>×</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function PrepItemRow({
  item,
  onToggle,
  onNotesChange,
}: {
  item: PrepSheetItem;
  onToggle: () => void;
  onNotesChange: (text: string) => void;
}) {
  return (
    <View style={[styles.prepItemRow, item.discussed && styles.prepItemDone]}>
      <TouchableOpacity
        style={styles.prepCheckArea}
        onPress={onToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: item.discussed }}
      >
        <View style={[styles.check, item.discussed && styles.checkDone]}>
          {item.discussed && <Text style={styles.checkMark}>✓</Text>}
        </View>
        <Text style={[styles.prepItemLabel, item.discussed && styles.prepItemLabelDone]}>
          {item.label}
        </Text>
      </TouchableOpacity>
      <TextInput
        style={styles.notesInput}
        placeholder="Add a note..."
        placeholderTextColor={colors.text.tertiary}
        value={item.notes}
        onChangeText={onNotesChange}
        returnKeyType="done"
      />
    </View>
  );
}

function FollowUpRow({ task, onToggle }: { task: FollowUpTask; onToggle: () => void }) {
  return (
    <TouchableOpacity
      style={styles.followUpRow}
      onPress={onToggle}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: task.done }}
    >
      <View style={[styles.check, task.done && styles.checkDone]}>
        {task.done && <Text style={styles.checkMark}>✓</Text>}
      </View>
      <Text style={[styles.followUpLabel, task.done && styles.followUpLabelDone]}>
        {task.label}
      </Text>
    </TouchableOpacity>
  );
}

export default function AdvisingScreen() {
  const { state, dispatch } = useAdvising();
  const { profile } = useStudentProfile();
  const { plan } = useSemesterPlan();
  const router = useRouter();
  const [customInput, setCustomInput] = useState('');
  const [followUpInput, setFollowUpInput] = useState('');

  const checkedCount = state.topics.filter((t) => t.checked).length;
  const hasPrepSheet = state.prepSheet !== null;

  function addCustomTopic() {
    const label = customInput.trim();
    if (!label) return;
    dispatch({ type: 'ADD_CUSTOM_TOPIC', label });
    setCustomInput('');
  }

  function addFollowUp() {
    const label = followUpInput.trim();
    if (!label) return;
    dispatch({ type: 'ADD_FOLLOW_UP', label });
    setFollowUpInput('');
  }

  if (hasPrepSheet) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <ResponsiveContainer>
            <TouchableOpacity
              onPress={() => dispatch({ type: 'CLEAR_PREP_SHEET' })}
              style={styles.backButton}
              accessibilityRole="button"
            >
              <Text style={styles.backLabel}>{'‹ Edit Topics'}</Text>
            </TouchableOpacity>

            <Text style={styles.heading}>Your Prep Sheet</Text>
            <Text style={styles.subheading}>
              Check off each topic as you discuss it with your advisor.
            </Text>

            {state.prepSheet!.map((item) => (
              <PrepItemRow
                key={item.id}
                item={item}
                onToggle={() => dispatch({ type: 'TOGGLE_PREP_ITEM', itemId: item.id })}
                onNotesChange={(notes) =>
                  dispatch({ type: 'UPDATE_PREP_NOTES', itemId: item.id, notes })
                }
              />
            ))}

            <Divider />

            <SectionLabel>After Your Meeting</SectionLabel>
            <Text style={styles.sectionSubtext}>
              Record any action items your advisor gave you so they show up on your dashboard.
            </Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.addInput}
                placeholder="e.g. Submit appeal form by Friday"
                placeholderTextColor={colors.text.tertiary}
                value={followUpInput}
                onChangeText={setFollowUpInput}
                onSubmitEditing={addFollowUp}
                returnKeyType="done"
              />
              <TouchableOpacity
                style={[styles.addButton, !followUpInput.trim() && styles.addButtonDisabled]}
                onPress={addFollowUp}
                disabled={!followUpInput.trim()}
                accessibilityRole="button"
              >
                <Text style={[styles.addButtonText, !followUpInput.trim() && styles.addButtonTextDisabled]}>
                  Add
                </Text>
              </TouchableOpacity>
            </View>

            {state.followUps.length > 0 && (
              <View style={styles.followUpList}>
                {state.followUps.map((task) => (
                  <FollowUpRow
                    key={task.id}
                    task={task}
                    onToggle={() => dispatch({ type: 'TOGGLE_FOLLOW_UP', taskId: task.id })}
                  />
                ))}
              </View>
            )}

            <Divider />

            <SectionLabel>Need to Make an Appointment?</SectionLabel>
            <Card style={styles.officeCardGap}>
              <View style={styles.officeCardInner}>
                <Text style={styles.officeName}>{advisingOffice.name}</Text>
                <Text style={styles.officeHours}>{advisingOffice.hours}</Text>
                <Button
                  label={`Call ${advisingOffice.phone}`}
                  onPress={() => Linking.openURL(`tel:${advisingOffice.phone.replace(/\D/g, '')}`)}
                  style={styles.callGap}
                />
                <Button
                  label={`Email ${advisingOffice.email}`}
                  onPress={() => Linking.openURL(`mailto:${advisingOffice.email}`)}
                  variant="secondary"
                  style={styles.emailGap}
                />
                <Button
                  label="View full contact info →"
                  onPress={() =>
                    router.push({
                      pathname: '/office/[officeId]',
                      params: { officeId: advisingOffice.id, reason: 'advising appointment' },
                    })
                  }
                  variant="ghost"
                />
              </View>
            </Card>
          </ResponsiveContainer>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ResponsiveContainer>
          <Text style={styles.heading}>Advising Prep</Text>
          <Text style={styles.subheading}>
            Build a prep sheet for your next advising appointment so you get the most out of it.
          </Text>

          <Card style={styles.summaryGap}>
            <View style={styles.summaryInner}>
              <Text style={styles.summaryLine}>
                <Text style={styles.summaryBold}>{profile.standing}</Text>
                {profile.major ? ` · ${profile.major}` : ''}
              </Text>
              <Text style={styles.summaryLine}>
                Semester plan:{' '}
                <Text style={styles.summaryBold}>
                  {plan.savedAt ? 'Saved — ready to review with advisor' : 'Not yet saved'}
                </Text>
              </Text>
            </View>
          </Card>

          <SectionLabel>Topics to Discuss</SectionLabel>
          <Text style={styles.sectionSubtext}>
            These were suggested based on your profile and activity. Uncheck anything you don't need.
          </Text>

          {state.topics.map((topic) => (
            <TopicRow
              key={topic.id}
              topic={topic}
              onToggle={() => dispatch({ type: 'TOGGLE_TOPIC', topicId: topic.id })}
              onRemove={
                topic.source === 'user'
                  ? () => dispatch({ type: 'REMOVE_TOPIC', topicId: topic.id })
                  : undefined
              }
            />
          ))}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.addInput}
              placeholder="Add your own topic..."
              placeholderTextColor={colors.text.tertiary}
              value={customInput}
              onChangeText={setCustomInput}
              onSubmitEditing={addCustomTopic}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[styles.addButton, !customInput.trim() && styles.addButtonDisabled]}
              onPress={addCustomTopic}
              disabled={!customInput.trim()}
              accessibilityRole="button"
            >
              <Text style={[styles.addButtonText, !customInput.trim() && styles.addButtonTextDisabled]}>
                Add
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            label={
              checkedCount > 0
                ? `Build My Prep Sheet (${checkedCount} topic${checkedCount > 1 ? 's' : ''})`
                : 'Build My Prep Sheet'
            }
            onPress={() => dispatch({ type: 'BUILD_PREP_SHEET' })}
            disabled={checkedCount === 0}
            style={styles.buildGap}
          />

          {checkedCount === 0 && (
            <Text style={styles.noneSelectedHint}>
              Select at least one topic to build your prep sheet.
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
  heading: { fontSize: typeScale.xl, fontWeight: '700', color: colors.text.primary, marginTop: 20, marginBottom: 4 },
  subheading: { fontSize: typeScale.sm + 1, color: colors.text.secondary, marginBottom: 20 },

  backButton: { marginTop: 12, marginBottom: 20, alignSelf: 'flex-start' },
  backLabel: { fontSize: typeScale.base, color: colors.navy, fontWeight: '500' },

  summaryGap: { marginBottom: 24 },
  summaryInner: { padding: 14, gap: 4 },
  summaryLine: { fontSize: typeScale.sm, color: colors.text.secondary },
  summaryBold: { fontWeight: '600', color: colors.text.primary },

  sectionSubtext: { fontSize: typeScale.sm, color: colors.text.tertiary, marginBottom: 12 },

  topicRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    marginBottom: 8,
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  topicCheckArea: {
    flex: 1,
    flexDirection: 'row',
    padding: 14,
    gap: 12,
    alignItems: 'flex-start',
  },
  topicBody: { flex: 1 },
  topicLabel: { fontSize: typeScale.sm + 1, fontWeight: '600', color: colors.text.primary, marginBottom: 3 },
  topicLabelUnchecked: { color: colors.text.tertiary, fontWeight: '400' },
  topicReason: { fontSize: typeScale.xs + 1, color: colors.text.tertiary, lineHeight: 17 },
  removeTopicButton: { paddingHorizontal: 14, paddingVertical: 14, justifyContent: 'center' },
  removeTopicText: { fontSize: 20, color: colors.disabled },

  check: {
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
  checkDone: { borderColor: colors.success, backgroundColor: colors.success },
  checkMark: { fontSize: 11, color: colors.text.inverse, fontWeight: '700' },

  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 16,
  },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: typeScale.sm + 1,
    color: colors.text.primary,
    backgroundColor: colors.surface,
  },
  addButton: {
    borderWidth: 1.5,
    borderColor: colors.navy,
    borderRadius: radius.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  addButtonDisabled: { borderColor: colors.disabled },
  addButtonText: { fontSize: typeScale.sm, fontWeight: '600', color: colors.navy },
  addButtonTextDisabled: { color: colors.disabled },

  buildGap: {},
  noneSelectedHint: { fontSize: typeScale.xs + 1, color: colors.text.tertiary, textAlign: 'center', marginTop: 8 },

  prepItemRow: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  prepItemDone: { borderColor: colors.disabled },
  prepCheckArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  prepItemLabel: { flex: 1, fontSize: typeScale.sm + 1, fontWeight: '600', color: colors.text.primary, marginTop: 1 },
  prepItemLabelDone: { color: colors.text.tertiary, textDecorationLine: 'line-through', fontWeight: '400' },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: typeScale.sm,
    color: colors.text.primary,
    marginLeft: 32,
  },

  followUpList: { gap: 8, marginBottom: 8 },
  followUpRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    gap: 12,
    backgroundColor: colors.surface,
  },
  followUpLabel: { flex: 1, fontSize: typeScale.sm + 1, color: colors.text.primary, lineHeight: 20 },
  followUpLabelDone: { color: colors.text.tertiary, textDecorationLine: 'line-through' },

  officeCardGap: { marginBottom: 8 },
  officeCardInner: { padding: 16 },
  officeName: { fontSize: typeScale.base, fontWeight: '600', color: colors.text.primary, marginBottom: 4 },
  officeHours: { fontSize: typeScale.sm, color: colors.text.secondary, marginBottom: 16 },
  callGap: { marginBottom: 8 },
  emailGap: { marginBottom: 4 },
});
