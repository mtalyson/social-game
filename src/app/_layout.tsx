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
            gestureEnabled: false,
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
