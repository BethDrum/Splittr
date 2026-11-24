import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from "../themes/themeSwitcher";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="shareReciept"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="setup"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="viewReciept"
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="splitReciept"
          options={{ headerShown: false }}
        />
        
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        />


      </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
