import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { SIDEBAR_WIDTH } from '@/constants/layout';
import { colors, radius, typeScale } from '@/constants/colors';

type NavItem = {
  name: string;
  label: string;
  icon: 'house.fill' | 'list.bullet' | 'calendar' | 'questionmark.circle.fill' | 'person.fill';
  href: string;
  matchPath: string;
};

const NAV_ITEMS: NavItem[] = [
  { name: 'index',     label: 'Home',      icon: 'house.fill',               href: '/',          matchPath: '/' },
  { name: 'plan',      label: 'Plan',      icon: 'list.bullet',              href: '/plan',      matchPath: '/plan' },
  { name: 'deadlines', label: 'Deadlines', icon: 'calendar',                 href: '/deadlines', matchPath: '/deadlines' },
  { name: 'help',      label: 'Help',      icon: 'questionmark.circle.fill', href: '/help',      matchPath: '/help' },
  { name: 'advising',  label: 'Advising',  icon: 'person.fill',              href: '/advising',  matchPath: '/advising' },
];

export function SidebarNav() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { isDesktop } = useBreakpoint();

  const width = isDesktop ? SIDEBAR_WIDTH.desktop : SIDEBAR_WIDTH.tablet;

  return (
    <View
      style={[
        styles.sidebar,
        { width, paddingTop: insets.top + 16, paddingBottom: insets.bottom + 16 },
      ]}
    >
      <Text style={styles.appName}>Wayfinder</Text>
      <View style={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.matchPath === '/'
              ? pathname === '/' || pathname === '/index'
              : pathname.startsWith(item.matchPath);
          return (
            <TouchableOpacity
              key={item.name}
              style={[styles.navItem, isActive && styles.navItemActive]}
              onPress={() => router.push(item.href as any)}
              accessibilityRole="menuitem"
              accessibilityState={{ selected: isActive }}
            >
              <IconSymbol
                name={item.icon}
                size={20}
                color={isActive ? '#fff' : 'rgba(255,255,255,0.45)'}
              />
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: colors.navy,
    paddingHorizontal: 12,
  },
  appName: {
    fontSize: typeScale.md,
    fontWeight: '700',
    color: colors.text.inverse,
    marginBottom: 32,
    paddingHorizontal: 8,
    letterSpacing: 0.3,
  },
  nav: { gap: 2 },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: radius.md,
  },
  navItemActive: { backgroundColor: 'rgba(255,255,255,0.15)' },
  navLabel: { fontSize: typeScale.sm, color: 'rgba(255,255,255,0.45)' },
  navLabelActive: { color: colors.text.inverse, fontWeight: '600' },
});
