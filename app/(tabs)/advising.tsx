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
import { useAdvising } from '@/context/AdvisingContext';
import { useStudentProfile } from '@/context/StudentProfileContext';
import { useSemesterPlan } from '@/context/SemesterPlanContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { OFFICE_CONTACTS } from '@/data/officeContacts';
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
        placeholderTextColor="#aaa"
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
              onPress={() => dispatch({ type: 'BUILD_PREP_SHEET' })}
              style={styles.backButton}
              accessibilityRole="button"
            >
              <Text style={styles.backLabel}>{'< Edit Topics'}</Text>
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

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>After Your Meeting</Text>
            <Text style={styles.sectionSubtext}>
              Record any action items your advisor gave you so they show up on your dashboard.
            </Text>

            <View style={styles.inputRow}>
              <TextInput
                style={styles.addInput}
                placeholder="e.g. Submit appeal form by Friday"
                placeholderTextColor="#aaa"
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
                <Text style={styles.addButtonText}>Add</Text>
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

            <View style={styles.divider} />

            <Text style={styles.sectionLabel}>Need to Make an Appointment?</Text>
            <View style={styles.officeCard}>
              <Text style={styles.officeName}>{advisingOffice.name}</Text>
              <Text style={styles.officeHours}>{advisingOffice.hours}</Text>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => Linking.openURL(`tel:${advisingOffice.phone.replace(/\D/g, '')}`)}
                accessibilityRole="button"
              >
                <Text style={styles.callButtonText}>Call {advisingOffice.phone}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.emailButton}
                onPress={() => Linking.openURL(`mailto:${advisingOffice.email}`)}
                accessibilityRole="button"
              >
                <Text style={styles.emailButtonText}>Email {advisingOffice.email}</Text>
              </TouchableOpacity>
            </View>
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

          {/* Summary card */}
          <View style={styles.summaryCard}>
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

          {/* Topics */}
          <Text style={styles.sectionLabel}>Topics to Discuss</Text>
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

          {/* Add custom topic */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.addInput}
              placeholder="Add your own topic..."
              placeholderTextColor="#aaa"
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
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Build prep sheet */}
          <TouchableOpacity
            style={[styles.buildButton, checkedCount === 0 && styles.buildButtonDisabled]}
            onPress={() => dispatch({ type: 'BUILD_PREP_SHEET' })}
            disabled={checkedCount === 0}
            accessibilityRole="button"
          >
            <Text style={styles.buildButtonText}>
              Build My Prep Sheet
              {checkedCount > 0 ? ` (${checkedCount} topic${checkedCount > 1 ? 's' : ''})` : ''}
            </Text>
          </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '700', color: '#111', marginTop: 20, marginBottom: 4 },
  subheading: { fontSize: 14, color: '#666', marginBottom: 20 },

  backButton: { marginTop: 12, marginBottom: 20, alignSelf: 'flex-start' },
  backLabel: { fontSize: 15, color: '#111', fontWeight: '500' },

  summaryCard: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 24,
    gap: 4,
  },
  summaryLine: { fontSize: 13, color: '#555' },
  summaryBold: { fontWeight: '600', color: '#111' },

  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 6 },
  sectionSubtext: { fontSize: 13, color: '#888', marginBottom: 12 },

  topicRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  topicCheckArea: {
    flex: 1,
    flexDirection: 'row',
    padding: 14,
    gap: 12,
    alignItems: 'flex-start',
  },
  topicBody: { flex: 1 },
  topicLabel: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 3 },
  topicLabelUnchecked: { color: '#999', fontWeight: '400' },
  topicReason: { fontSize: 12, color: '#888', lineHeight: 17 },
  removeTopicButton: { paddingHorizontal: 14, paddingVertical: 14, justifyContent: 'center' },
  removeTopicText: { fontSize: 20, color: '#bbb' },

  check: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#888',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  checkDone: { borderColor: '#111', backgroundColor: '#111' },
  checkMark: { fontSize: 11, color: '#fff', fontWeight: '700' },

  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
    marginBottom: 16,
  },
  addInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#111',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  addButtonDisabled: { borderColor: '#ddd' },
  addButtonText: { fontSize: 13, fontWeight: '600', color: '#111' },

  buildButton: {
    backgroundColor: '#111',
    paddingVertical: 14,
    alignItems: 'center',
  },
  buildButtonDisabled: { backgroundColor: '#ccc' },
  buildButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  noneSelectedHint: { fontSize: 12, color: '#aaa', textAlign: 'center', marginTop: 8 },

  divider: { height: 1, backgroundColor: '#e5e5e5', marginVertical: 24 },

  prepItemRow: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 8,
  },
  prepItemDone: { borderColor: '#ccc' },
  prepCheckArea: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 10,
  },
  prepItemLabel: { flex: 1, fontSize: 14, fontWeight: '600', color: '#111', marginTop: 1 },
  prepItemLabelDone: { color: '#999', textDecorationLine: 'line-through', fontWeight: '400' },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#333',
    marginLeft: 32,
  },

  followUpList: { gap: 8, marginBottom: 8 },
  followUpRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    gap: 12,
  },
  followUpLabel: { flex: 1, fontSize: 14, color: '#222', lineHeight: 20 },
  followUpLabelDone: { color: '#999', textDecorationLine: 'line-through' },

  officeCard: { borderWidth: 1, borderColor: '#e5e5e5', padding: 16, marginBottom: 8 },
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
});
