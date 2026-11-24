import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GameProvider } from '@/features/game/context/gameContext';
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
        <Stack.Screen name="(home)/index" />
        <Stack.Screen name="(game)/setup" />
        <Stack.Screen
          name="(game)/game"
          options={{
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="(game)/round-result"
          options={{
            gestureEnabled: false,
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="(info)/how-to-play"
          options={{
            animation: 'slide_from_bottom',
            presentation: 'modal',
          }}
        />
      </Stack>
    </GameProvider>
  );
}
