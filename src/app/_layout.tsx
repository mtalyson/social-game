/**
 * Root layout for Expo Router.
 *
 * Wraps all screens with the GameProvider and configures the Stack Navigator
 * with the dark bar theme. All screens use headerShown: false for custom headers.
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '@/hooks/useGame';
import { colors } from '@/theme/colors';

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="setup" />
        <Stack.Screen
          name="game"
          options={{
            gestureEnabled: false, // Prevent accidental back swipe during gameplay
          }}
        />
        <Stack.Screen
          name="round-result"
          options={{
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="how-to-play"
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
      </Stack>
    </GameProvider>
  );
}
