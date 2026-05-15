import { Text, StyleSheet, type StyleProp, type TextStyle } from 'react-native';
import { colors, typeScale } from '@/constants/colors';

interface SectionLabelProps {
  children: string;
  style?: StyleProp<TextStyle>;
}

export function SectionLabel({ children, style }: SectionLabelProps) {
  return <Text style={[styles.label, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  label: {
    fontSize: typeScale.sm,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 10,
  },
});
