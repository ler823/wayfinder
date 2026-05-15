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
import { useStudentProfile } from '@/context/StudentProfileContext';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { GLOSSARY } from '@/data/glossary';
import { OFFICE_CONTACTS } from '@/data/officeContacts';
import { colors, radius, typeScale } from '@/constants/colors';
import type { GlossaryTerm } from '@/data/glossary';
import type { OfficeContact } from '@/data/officeContacts';

function TermRow({
  term,
  isExpanded,
  onToggle,
}: {
  term: GlossaryTerm;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.termBlock}>
      <TouchableOpacity
        style={[styles.termRow, isExpanded && styles.termRowExpanded]}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
      >
        <Text style={styles.termLabel}>{term.term}</Text>
        <Text style={styles.termChevron}>{isExpanded ? '∧' : '∨'}</Text>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.termDefinitionBox}>
          <Text style={styles.termDefinitionText}>{term.definition}</Text>
        </View>
      )}
    </View>
  );
}

function OfficeRow({ office }: { office: OfficeContact }) {
  return (
    <View style={styles.officeRow}>
      <View style={styles.officeInfo}>
        <Text style={styles.officeName}>{office.name}</Text>
        <Text style={styles.officeHours}>{office.hours}</Text>
      </View>
      <View style={styles.officeLinks}>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${office.phone.replace(/\D/g, '')}`)}
          accessibilityRole="button"
        >
          <Text style={styles.officeLink}>Call</Text>
        </TouchableOpacity>
        <Text style={styles.officeLinkDivider}>·</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(`mailto:${office.email}`)}
          accessibilityRole="button"
        >
          <Text style={styles.officeLink}>Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HelpScreen() {
  const { dispatch } = useStudentProfile();
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = query.trim()
    ? GLOSSARY.filter(
        (t) =>
          t.term.toLowerCase().includes(query.toLowerCase()) ||
          t.definition.toLowerCase().includes(query.toLowerCase()),
      )
    : GLOSSARY;

  function toggleTerm(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ResponsiveContainer>
          <Text style={styles.heading}>Help & Glossary</Text>
          <Text style={styles.subheading}>
            Plain-language explanations of common college terms.
          </Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search terms..."
            placeholderTextColor={colors.text.tertiary}
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setExpandedId(null);
            }}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />

          <SectionLabel>Common Terms</SectionLabel>

          {filtered.length === 0 ? (
            <Text style={styles.emptyText}>No terms match "{query}".</Text>
          ) : (
            filtered.map((term) => (
              <TermRow
                key={term.id}
                term={term}
                isExpanded={expandedId === term.id}
                onToggle={() => toggleTerm(term.id)}
              />
            ))
          )}

          <Divider />

          <SectionLabel>Still Need Help?</SectionLabel>
          <Text style={styles.sectionSubtext}>
            These offices can answer questions about your specific situation.
          </Text>

          {OFFICE_CONTACTS.map((office) => (
            <OfficeRow key={office.id} office={office} />
          ))}

          <Divider />

          <SectionLabel>Account</SectionLabel>
          <Button
            label="Restart Onboarding"
            onPress={() => dispatch({ type: 'RESET' })}
            variant="secondary"
          />
        </ResponsiveContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },
  heading: { fontSize: typeScale.xl, fontWeight: '700', color: colors.text.primary, marginTop: 20, marginBottom: 4 },
  subheading: { fontSize: typeScale.sm + 1, color: colors.text.secondary, marginBottom: 16 },

  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: typeScale.sm + 1,
    color: colors.text.primary,
    marginBottom: 20,
    backgroundColor: colors.surface,
  },

  sectionSubtext: { fontSize: typeScale.sm, color: colors.text.tertiary, marginBottom: 12 },

  termBlock: { marginBottom: 1 },
  termRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.surface,
    marginBottom: 0,
  },
  termRowExpanded: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  termLabel: { fontSize: typeScale.sm + 1, fontWeight: '600', color: colors.text.primary, flex: 1 },
  termChevron: { fontSize: typeScale.xs + 1, color: colors.text.tertiary, marginLeft: 8 },
  termDefinitionBox: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: colors.border,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
    padding: 14,
    marginBottom: 8,
    backgroundColor: colors.surfaceSubtle,
  },
  termDefinitionText: { fontSize: typeScale.sm + 1, color: colors.text.primary, lineHeight: 21 },

  emptyText: { fontSize: typeScale.sm + 1, color: colors.text.tertiary, marginBottom: 16 },

  officeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: 14,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  officeInfo: { flex: 1 },
  officeName: { fontSize: typeScale.sm + 1, fontWeight: '600', color: colors.text.primary, marginBottom: 2 },
  officeHours: { fontSize: typeScale.xs + 1, color: colors.text.tertiary },
  officeLinks: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 12 },
  officeLink: { fontSize: typeScale.sm, fontWeight: '600', color: colors.navy },
  officeLinkDivider: { fontSize: typeScale.sm, color: colors.disabled },
});
