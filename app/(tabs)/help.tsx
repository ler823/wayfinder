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
import { GLOSSARY } from '@/data/glossary';
import { OFFICE_CONTACTS } from '@/data/officeContacts';
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
        style={styles.termRow}
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
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              setExpandedId(null);
            }}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />

          <Text style={styles.sectionLabel}>Common Terms</Text>

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

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Still Need Help?</Text>
          <Text style={styles.sectionSubtext}>
            These offices can answer questions about your specific situation.
          </Text>

          {OFFICE_CONTACTS.map((office) => (
            <OfficeRow key={office.id} office={office} />
          ))}

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Account</Text>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => dispatch({ type: 'RESET' })}
            accessibilityRole="button"
          >
            <Text style={styles.resetButtonText}>Restart Onboarding</Text>
          </TouchableOpacity>
        </ResponsiveContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 40 },
  heading: { fontSize: 22, fontWeight: '700', color: '#111', marginTop: 20, marginBottom: 4 },
  subheading: { fontSize: 14, color: '#666', marginBottom: 16 },

  searchInput: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111',
    marginBottom: 20,
  },

  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 10 },
  sectionSubtext: { fontSize: 13, color: '#888', marginBottom: 12 },

  termBlock: { marginBottom: 1 },
  termRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  termLabel: { fontSize: 14, fontWeight: '600', color: '#111', flex: 1 },
  termChevron: { fontSize: 12, color: '#888', marginLeft: 8 },
  termDefinitionBox: {
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 8,
  },
  termDefinitionText: { fontSize: 14, color: '#333', lineHeight: 21 },

  emptyText: { fontSize: 14, color: '#888', marginBottom: 16 },

  divider: { height: 1, backgroundColor: '#e5e5e5', marginVertical: 24 },

  officeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 8,
  },
  officeInfo: { flex: 1 },
  officeName: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 2 },
  officeHours: { fontSize: 12, color: '#888' },
  officeLinks: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 12 },
  officeLink: { fontSize: 13, fontWeight: '600', color: '#111' },
  officeLinkDivider: { fontSize: 13, color: '#ccc' },

  resetButton: {
    borderWidth: 1,
    borderColor: '#111',
    paddingVertical: 14,
    alignItems: 'center',
  },
  resetButtonText: { fontSize: 15, fontWeight: '600', color: '#111' },
});
