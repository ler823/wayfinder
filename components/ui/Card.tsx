import { View, TouchableOpacity, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import type { ReactNode } from 'react';
import { colors, radius } from '@/constants/colors';

type Variant = 'default' | 'urgent' | 'info';

interface CardProps {
  children: ReactNode;
  variant?: Variant;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function Card({ children, variant = 'default', onPress, style }: CardProps) {
  const containerStyle = [
    styles.card,
    variant === 'urgent' && styles.urgent,
    variant === 'info' && styles.info,
    style,
  ];

  if (onPress) {
    return (
      <TouchableOpacity style={containerStyle} onPress={onPress} accessibilityRole="button">
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={containerStyle}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    marginBottom: 12,
    overflow: 'hidden',
  },
  urgent: {
    borderColor: colors.urgent,
  },
  info: {
    backgroundColor: colors.surfaceSubtle,
  },
});
