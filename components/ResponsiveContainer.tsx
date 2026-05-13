import { View, type ViewProps } from 'react-native';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { HORIZONTAL_PADDING, MAX_CONTENT_WIDTH } from '@/constants/layout';

type Props = ViewProps & {
  children: React.ReactNode;
};

export function ResponsiveContainer({ children, style, ...rest }: Props) {
  const { isMobile, isTablet } = useBreakpoint();

  const maxWidth = isMobile
    ? undefined
    : isTablet
    ? MAX_CONTENT_WIDTH.tablet
    : MAX_CONTENT_WIDTH.desktop;

  const paddingHorizontal = isMobile
    ? HORIZONTAL_PADDING.mobile
    : isTablet
    ? HORIZONTAL_PADDING.tablet
    : HORIZONTAL_PADDING.desktop;

  return (
    <View
      style={[{ width: '100%', maxWidth, alignSelf: 'center', paddingHorizontal }, style]}
      {...rest}
    >
      {children}
    </View>
  );
}
