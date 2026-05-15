import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, typeScale } from '@/constants/colors';

type Category = keyof typeof colors.category;

interface BadgeProps {
  category: Category;
  label: string;
}

export function Badge({ category, label }: BadgeProps) {
  const scheme = colors.category[category] ?? { bg: colors.surfaceSubtle, text: colors.text.secondary };
  return (
    <View style={[styles.badge, { backgroundColor: scheme.bg }]}>
      <Text style={[styles.label, { color: scheme.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: radius.sm,
  },
  label: {
    fontSize: typeScale.xs,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
