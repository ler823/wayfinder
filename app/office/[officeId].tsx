import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OFFICE_CONTACTS, type OfficeContact } from '@/data/officeContacts';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

function suggestedScript(officeId: string, reason?: string): string {
  const topic = reason ? `about ${reason.toLowerCase()}` : 'about my academic situation';
  switch (officeId) {
    case 'financial-aid':
      return `"Hi, I'm calling because I have a question ${topic}. Can I speak with a financial aid counselor or schedule an appointment? My name is [your name] and my BeachID is [your BeachID]."`;
    case 'registrar':
      return `"Hi, I'm a CSULB student and I have a question ${topic}. Can someone help me or schedule an appointment? My name is [your name] and my BeachID is [your BeachID]."`;
    case 'advising':
      return `"Hi, my name is [your name] and I'm a student in [your major]. I'd like to schedule an advising appointment ${topic}. What's your earliest available time this week or next?"`;
    default:
      return `"Hi, my name is [your name] and I'm a CSULB student. I'm calling ${topic} and could use some guidance. Can I schedule an appointment?"`;
  }
}

function SmallOfficeRow({ office }: { office: OfficeContact }) {
  return (
    <View style={styles.altOfficeRow}>
      <View style={styles.altOfficeInfo}>
        <Text style={styles.altOfficeName}>{office.name}</Text>
        <Text style={styles.altOfficeHours}>{office.hours}</Text>
      </View>
      <View style={styles.altOfficeActions}>
        <TouchableOpacity
          onPress={() => Linking.openURL(`tel:${office.phone.replace(/\D/g, '')}`)}
          accessibilityRole="button"
        >
          <Text style={styles.altOfficeLink}>Call</Text>
        </TouchableOpacity>
        <Text style={styles.altOfficeDot}>·</Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(`mailto:${office.email}`)}
          accessibilityRole="button"
        >
          <Text style={styles.altOfficeLink}>Email</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function OfficeContactScreen() {
  const { officeId, reason } = useLocalSearchParams<{ officeId: string; reason?: string }>();
  const router = useRouter();

  const office = OFFICE_CONTACTS.find((o) => o.id === officeId);
  const otherOffices = OFFICE_CONTACTS.filter((o) => o.id !== officeId);

  if (!office) {
    return (
      <SafeAreaView style={styles.container}>
        <ResponsiveContainer>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
            <Text style={styles.backLabel}>{'< Back'}</Text>
          </TouchableOpacity>
          <Text style={styles.notFound}>Office not found.</Text>
        </ResponsiveContainer>
      </SafeAreaView>
    );
  }

  const script = suggestedScript(officeId, reason);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ResponsiveContainer>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
            <Text style={styles.backLabel}>{'< Back'}</Text>
          </TouchableOpacity>

          {reason ? (
            <View style={styles.reasonCard}>
              <Text style={styles.reasonHeading}>Why this office</Text>
              <Text style={styles.reasonText}>
                {office.name} handles <Text style={styles.reasonBold}>{reason.toLowerCase()}</Text>. They're the right first call.
              </Text>
            </View>
          ) : null}

          <Text style={styles.officeName}>{office.name}</Text>
          <Text style={styles.officeHours}>{office.hours}</Text>

          <TouchableOpacity
            style={styles.callButton}
            onPress={() => Linking.openURL(`tel:${office.phone.replace(/\D/g, '')}`)}
            accessibilityRole="button"
          >
            <Text style={styles.callButtonText}>Call Now — {office.phone}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.emailButton}
            onPress={() => Linking.openURL(`mailto:${office.email}`)}
            accessibilityRole="button"
          >
            <Text style={styles.emailButtonText}>Send Email Instead — {office.email}</Text>
          </TouchableOpacity>

          <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Suggested opening</Text>
          <Text style={styles.sectionSubtext}>Adapt this when you call or walk in — you don't need to memorize it.</Text>
          <View style={styles.scriptBox}>
            <Text style={styles.scriptText}>{script}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionLabel}>Not the right office?</Text>
          <Text style={styles.sectionSubtext}>These offices may also be able to help.</Text>
          {otherOffices.map((o) => (
            <SmallOfficeRow key={o.id} office={o} />
          ))}
        </ResponsiveContainer>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 40 },
  notFound: { fontSize: 15, color: '#666', marginTop: 20 },

  backButton: { marginTop: 12, marginBottom: 20, alignSelf: 'flex-start' },
  backLabel: { fontSize: 15, color: '#111', fontWeight: '500' },

  reasonCard: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 20,
  },
  reasonHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#555',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  reasonText: { fontSize: 14, color: '#333', lineHeight: 21 },
  reasonBold: { fontWeight: '600', color: '#111' },

  officeName: { fontSize: 22, fontWeight: '700', color: '#111', marginBottom: 4 },
  officeHours: { fontSize: 14, color: '#666', marginBottom: 20 },

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
    marginBottom: 8,
  },
  emailButtonText: { color: '#111', fontSize: 15, fontWeight: '600' },

  sectionLabel: { fontSize: 13, fontWeight: '600', color: '#666', marginBottom: 6 },
  sectionSubtext: { fontSize: 13, color: '#888', marginBottom: 12 },

  scriptBox: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#fafafa',
    padding: 16,
    marginBottom: 8,
  },
  scriptText: { fontSize: 14, color: '#333', lineHeight: 22, fontStyle: 'italic' },

  divider: { height: 1, backgroundColor: '#e5e5e5', marginVertical: 24 },

  altOfficeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    padding: 14,
    marginBottom: 8,
  },
  altOfficeInfo: { flex: 1 },
  altOfficeName: { fontSize: 14, fontWeight: '600', color: '#111', marginBottom: 2 },
  altOfficeHours: { fontSize: 12, color: '#888' },
  altOfficeActions: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 12 },
  altOfficeLink: { fontSize: 13, fontWeight: '600', color: '#111' },
  altOfficeDot: { fontSize: 13, color: '#ccc' },
});
