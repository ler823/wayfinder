import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { colors, radius, typeScale } from '@/constants/colors';

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
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  cellActive: {
    borderColor: colors.navy,
    backgroundColor: colors.navy,
  },
  cellText: { fontSize: typeScale.base, color: colors.text.secondary },
  cellTextActive: { color: colors.text.inverse, fontWeight: '600' },
});
