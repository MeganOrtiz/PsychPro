import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import {
  Montserrat_200ExtraLight,
  Montserrat_400Regular,
  Montserrat_600SemiBold,
} from '@expo-google-fonts/montserrat';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo';
import { setBaseUrl, setAuthTokenGetter } from '@workspace/api-client-react';
import { tokenCache } from '@/lib/token-cache';
import { ActivityIndicator, View } from 'react-native';

// Point every generated API hook at the shared PsychPro api-server.
setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`);

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

// The stored secret is a badly pasted blob ("NEXT_PUBLIC_...=pk_test_... CLERK_SECRET_KEY=sk_...").
// Secrets can't be normalized programmatically, so extract the pk_ key here.
function normalizePublishableKey(raw: string | undefined): string {
  if (!raw) return '';
  const match = raw.match(/pk_(test|live)_[A-Za-z0-9$]+/);
  return match ? match[0] : raw.trim();
}

const CLERK_PUBLISHABLE_KEY = normalizePublishableKey(process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY);

/** Wires Clerk session tokens into the API client + gates routes by auth. */
function AuthGate() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    setAuthTokenGetter(() => getToken());
    return () => setAuthTokenGetter(null);
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!isSignedIn && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (isSignedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoaded, isSignedIn, segments, router]);

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
        <ActivityIndicator color="#24282c" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Montserrat_200ExtraLight,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY} tokenCache={tokenCache}>
          <ClerkLoaded>
            <QueryClientProvider client={queryClient}>
              <GestureHandlerRootView>
                <KeyboardProvider>
                  <AuthGate />
                </KeyboardProvider>
              </GestureHandlerRootView>
            </QueryClientProvider>
          </ClerkLoaded>
        </ClerkProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
