import React, { useState } from 'react';
import { Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
import { useSignUp } from '@clerk/clerk-expo';
import { Screen, BrandTitle, ChromeButton, INK } from '@/components/ui';

export default function SignUpScreen() {
  const { signUp, setActive, isLoaded } = useSignUp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onSignUp = async () => {
    if (!isLoaded || busy) return;
    setBusy(true);
    setError(null);
    try {
      await signUp.create({ emailAddress: email.trim(), password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setVerifying(true);
    } catch (e: any) {
      setError(e?.errors?.[0]?.longMessage ?? e?.errors?.[0]?.message ?? 'Sign up failed.');
    } finally {
      setBusy(false);
    }
  };

  const onVerify = async () => {
    if (!isLoaded || busy) return;
    setBusy(true);
    setError(null);
    try {
      const attempt = await signUp.attemptEmailAddressVerification({ code: code.trim() });
      if (attempt.status === 'complete') {
        await setActive({ session: attempt.createdSessionId });
      } else {
        setError('Verification incomplete. Check the code and try again.');
      }
    } catch (e: any) {
      setError(e?.errors?.[0]?.longMessage ?? e?.errors?.[0]?.message ?? 'Verification failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Screen scroll={false} style={{ justifyContent: 'center' }}>
      <View style={{ alignItems: 'center', marginBottom: 36 }}>
        <BrandTitle size={26}>PsychPro</BrandTitle>
        <Text style={{ fontFamily: 'Inter_400Regular', color: INK.inkDim, marginTop: 10, fontSize: 13 }}>
          {verifying ? `Enter the code we emailed to ${email.trim()}` : 'Create your account'}
        </Text>
      </View>

      {verifying ? (
        <>
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Verification code"
            placeholderTextColor={INK.inkDim}
            keyboardType="number-pad"
            style={inputStyle}
          />
          {error ? <Text style={errStyle}>{error}</Text> : null}
          <ChromeButton title="Verify Email" onPress={onVerify} loading={busy} disabled={!code} />
        </>
      ) : (
        <>
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
            placeholder="Password (8+ characters)"
            placeholderTextColor={INK.inkDim}
            secureTextEntry
            style={inputStyle}
          />
          {error ? <Text style={errStyle}>{error}</Text> : null}
          <ChromeButton title="Create Account" onPress={onSignUp} loading={busy} disabled={!email || password.length < 8} />
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 22, gap: 4 }}>
            <Text style={{ fontFamily: 'Inter_400Regular', color: INK.inkDim, fontSize: 13 }}>Already have an account?</Text>
            <Link href="/(auth)/sign-in">
              <Text style={{ fontFamily: 'Inter_600SemiBold', color: INK.cyan, fontSize: 13 }}>Sign in</Text>
            </Link>
          </View>
        </>
      )}
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

const errStyle = {
  fontFamily: 'Inter_500Medium',
  color: '#b91c1c',
  fontSize: 13,
  marginBottom: 10,
} as const;
