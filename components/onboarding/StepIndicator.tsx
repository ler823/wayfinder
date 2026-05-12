import { View, Text, StyleSheet } from 'react-native';

type Props = {
  current: number;
  total: number;
};

export default function StepIndicator({ current, total }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View key={i} style={[styles.segment, i < current && styles.segmentFilled]} />
      ))}
      <Text style={styles.label}>
        Step {current} of {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  segment: { height: 4, flex: 1, backgroundColor: '#ddd' },
  segmentFilled: { backgroundColor: '#111' },
  label: { fontSize: 12, color: '#666', marginLeft: 8, whiteSpace: 'nowrap' } as any,
});
