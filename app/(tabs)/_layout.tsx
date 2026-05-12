import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useStudentProfile } from '@/context/StudentProfileContext';

export default function TabLayout() {
  const { profile, isLoaded } = useStudentProfile();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !profile.onboardingComplete) {
      router.replace('/(onboarding)/welcome');
    }
  }, [isLoaded, profile.onboardingComplete]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#111',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { borderTopWidth: 1, borderTopColor: '#e5e5e5' },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol name="house.fill" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ color }) => <IconSymbol name="list.bullet" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="deadlines"
        options={{
          title: 'Deadlines',
          tabBarIcon: ({ color }) => <IconSymbol name="calendar" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="help"
        options={{
          title: 'Help',
          tabBarIcon: ({ color }) => <IconSymbol name="questionmark.circle.fill" size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="advising"
        options={{
          title: 'Advising',
          tabBarIcon: ({ color }) => <IconSymbol name="person.fill" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
