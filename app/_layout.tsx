import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { StudentProfileProvider } from '@/context/StudentProfileContext';
import { DeadlinesProvider } from '@/context/DeadlinesContext';
import { SemesterPlanProvider } from '@/context/SemesterPlanContext';
import { AdvisingProvider } from '@/context/AdvisingContext';
import { AcademicRecoveryProvider } from '@/context/AcademicRecoveryContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <StudentProfileProvider>
      <DeadlinesProvider>
        <SemesterPlanProvider>
          <AdvisingProvider>
            <AcademicRecoveryProvider>
              <Stack>
                <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="deadline/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="recovery/[issueId]" options={{ headerShown: false }} />
                <Stack.Screen name="office/[officeId]" options={{ headerShown: false }} />
              </Stack>
              <StatusBar style="dark" />
            </AcademicRecoveryProvider>
          </AdvisingProvider>
        </SemesterPlanProvider>
      </DeadlinesProvider>
    </StudentProfileProvider>
  );
}
