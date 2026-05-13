import { useWindowDimensions } from 'react-native';
import { BREAKPOINTS } from '@/constants/layout';

export type Breakpoint = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
};

export function useBreakpoint(): Breakpoint {
  const { width, height } = useWindowDimensions();
  return {
    isMobile: width < BREAKPOINTS.tablet,
    isTablet: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop,
    width,
    height,
  };
}
