import { TouchableOpacity, Text, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { colors, radius, typeScale } from '@/constants/colors';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function Button({ label, onPress, variant = 'primary', disabled = false, style }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        disabled && variant === 'primary' && styles.primaryDisabled,
        disabled && variant === 'secondary' && styles.secondaryDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
    >
      <Text
        style={[
          styles.labelBase,
          variant === 'primary' && styles.primaryLabel,
          variant === 'secondary' && styles.secondaryLabel,
          variant === 'ghost' && styles.ghostLabel,
          disabled && styles.disabledLabel,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: radius.md,
  },
  primary: {
    backgroundColor: colors.action,
  },
  primaryDisabled: {
    backgroundColor: '#DDB88A',
  },
  secondary: {
    borderWidth: 1.5,
    borderColor: colors.navy,
    backgroundColor: 'transparent',
  },
  secondaryDisabled: {
    borderColor: colors.disabled,
  },
  ghost: {
    paddingVertical: 10,
  },

  labelBase: {
    fontSize: typeScale.base,
    fontWeight: '600',
  },
  primaryLabel: {
    color: colors.text.inverse,
  },
  secondaryLabel: {
    color: colors.navy,
  },
  ghostLabel: {
    color: colors.text.secondary,
    fontWeight: '500',
    fontSize: typeScale.sm,
  },
  disabledLabel: {
    opacity: 0.6,
  },
});
