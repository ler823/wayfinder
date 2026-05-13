import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useBreakpoint } from '@/hooks/useBreakpoint';

type Props = {
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
};

export default function OptionGrid({ options, selected, onSelect }: Props) {
  const { isMobile, isTablet } = useBreakpoint();
  const minWidth = isMobile ? '45%' : isTablet ? '30%' : '22%';

  return (
    <View style={styles.grid}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt}
          style={[styles.cell, { minWidth }, selected === opt && styles.cellActive]}
          onPress={() => onSelect(opt)}
          accessibilityRole="radio"
          accessibilityState={{ checked: selected === opt }}
        >
          <Text style={[styles.cellText, selected === opt && styles.cellTextActive]}>
            {opt}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  cell: {
    flex: 1,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  cellActive: { borderColor: '#111', backgroundColor: '#111' },
  cellText: { fontSize: 15, color: '#333' },
  cellTextActive: { color: '#fff', fontWeight: '600' },
});
