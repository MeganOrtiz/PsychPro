import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { useSignIn } from '@clerk/clerk-expo';
import { Screen, BrandTitle, ChromeButton, INK } from '@/components/ui';

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSignIn = async () => {
    if (!isLoaded || busy) return;
    setBusy(true);
    setError(null);
    try {
      const attempt = await signIn.create({ identifier: email.trim(), password });
      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
      } else {
        setError('Additional verification required. Please sign in on the website first.');
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.longMessage ?? e?.errors?.[0]?.message ?? 'Sign in failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll={false} style={{ justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', marginBottom: 36 }}>
        <BrandTitle size={26}>PsychPro</BrandTitle>
        <Text style={{ fontFamily: 'Inter_400Regular', color: INK.inkDim, marginTop: 10, fontSize: 13 }}>
          Sign in to continue studying
        </Text>
      </View>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={INK.inkDim}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        style={inputStyle}
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={INK.inkDim}
        secureTextEntry
        style={inputStyle}
      />

      {error ? (
        <Text style={{ fontFamily: 'Inter_500Medium', color: '#b91c1c', fontSize: 13, marginBottom: 10 }}>{error}</Text>
      ) : null}

      <ChromeButton title="Sign In" onPress={onSignIn} loading={busy} disabled={!email || !password} />

      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 22, gap: 4 }}>
        <Text style={{ fontFamily: 'Inter_400Regular', color: INK.inkDim, fontSize: 13 }}>New to PsychPro?</Text>
        <Link href="/(auth)/sign-up">
          <Text style={{ fontFamily: 'Inter_600SemiBold', color: INK.cyan, fontSize: 13 }}>Create an account</Text>
        </Link>
      </View>
    </Screen>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: '#c8d2d6',
  borderRadius: 10,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 15,
  fontFamily: 'Inter_400Regular',
  color: '#24282c',
  backgroundColor: '#ffffff',
  marginBottom: 12,
} as const;
