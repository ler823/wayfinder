import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { OFFICE_CONTACTS, type OfficeContact } from '@/data/officeContacts';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Divider } from '@/components/ui/Divider';
import { colors, radius, typeScale } from '@/constants/colors';

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
            <Text style={styles.backLabel}>{'‹ Back'}</Text>
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
            <Text style={styles.backLabel}>{'‹ Back'}</Text>
          </TouchableOpacity>

          {reason ? (
            <Card style={styles.reasonGap}>
              <View style={styles.reasonInner}>
                <Text style={styles.reasonHeading}>WHY THIS OFFICE</Text>
                <Text style={styles.reasonText}>
                  {office.name} handles{' '}
                  <Text style={styles.reasonBold}>{reason.toLowerCase()}</Text>. They're the right first call.
                </Text>
              </View>
            </Card>
          ) : null}

          <Text style={styles.officeName}>{office.name}</Text>
          <Text style={styles.officeHours}>{office.hours}</Text>

          <Button
            label={`Call Now — ${office.phone}`}
            onPress={() => Linking.openURL(`tel:${office.phone.replace(/\D/g, '')}`)}
            style={styles.callGap}
          />
          <Button
            label={`Send Email Instead — ${office.email}`}
            onPress={() => Linking.openURL(`mailto:${office.email}`)}
            variant="secondary"
            style={styles.emailGap}
          />

          <SectionLabel style={styles.scriptLabel}>Suggested opening</SectionLabel>
          <Text style={styles.sectionSubtext}>
            Adapt this when you call or walk in — you don't need to memorize it.
          </Text>
          <Card variant="info" style={styles.scriptGap}>
            <View style={styles.scriptInner}>
              <Text style={styles.scriptText}>{script}</Text>
            </View>
          </Card>

          <Divider />

          <SectionLabel>Not the right office?</SectionLabel>
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
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },
  notFound: { fontSize: typeScale.base, color: colors.text.secondary, marginTop: 20 },

  backButton: { marginTop: 12, marginBottom: 20, alignSelf: 'flex-start' },
  backLabel: { fontSize: typeScale.base, color: colors.navy, fontWeight: '500' },

  reasonGap: { marginBottom: 20 },
  reasonInner: { padding: 14 },
  reasonHeading: {
    fontSize: typeScale.xs,
    fontWeight: '700',
    color: colors.text.secondary,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  reasonText: { fontSize: typeScale.sm + 1, color: colors.text.primary, lineHeight: 21 },
  reasonBold: { fontWeight: '600', color: colors.text.primary },

  officeName: { fontSize: typeScale.xl, fontWeight: '700', color: colors.text.primary, marginBottom: 4 },
  officeHours: { fontSize: typeScale.sm + 1, color: colors.text.secondary, marginBottom: 20 },

  callGap: { marginBottom: 8 },
  emailGap: { marginBottom: 0 },

  scriptLabel: { marginTop: 24 },
  sectionSubtext: { fontSize: typeScale.sm, color: colors.text.tertiary, marginBottom: 12 },

  scriptGap: { marginBottom: 8 },
  scriptInner: { padding: 16 },
  scriptText: { fontSize: typeScale.sm + 1, color: colors.text.primary, lineHeight: 22, fontStyle: 'italic' },

  altOfficeRow: {
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
  altOfficeInfo: { flex: 1 },
  altOfficeName: { fontSize: typeScale.sm + 1, fontWeight: '600', color: colors.text.primary, marginBottom: 2 },
  altOfficeHours: { fontSize: typeScale.xs + 1, color: colors.text.tertiary },
  altOfficeActions: { flexDirection: 'row', alignItems: 'center', gap: 6, marginLeft: 12 },
  altOfficeLink: { fontSize: typeScale.sm, fontWeight: '600', color: colors.navy },
  altOfficeDot: { fontSize: typeScale.sm, color: colors.disabled },
});
