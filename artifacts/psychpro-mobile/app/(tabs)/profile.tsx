import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useAuth, useUser } from '@clerk/clerk-expo';
import {
  useGetSubscriptionStatus,
  useGetUserUsage,
  useCreatePortalSession,
} from '@workspace/api-client-react';
import {
  Screen,
  BrandTitle,
  SectionLabel,
  Card,
  ChromeButton,
  GhostButton,
  INK,
} from '@/components/ui';

function tierLabel(status?: { status: string; tier?: string | null }) {
  if (!status || status.status === 'free') return 'Free';
  const t = (status.tier ?? '').toLowerCase();
  if (t === 'scholar') return 'Scholar';
  if (t === 'pro') return 'Master';
  return status.status === 'active' ? 'Subscribed' : status.status;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();
  const { data: sub } = useGetSubscriptionStatus();
  const { data: usage } = useGetUserUsage();
  const portal = useCreatePortalSession();

  const openPortal = async () => {
    try {
      const res = await portal.mutateAsync();
      if (res?.url) await WebBrowser.openBrowserAsync(res.url);
    } catch {
      // Portal unavailable (e.g. free tier) — ignore.
    }
  };

  const email = user?.primaryEmailAddress?.emailAddress ?? '';
  const isPaid = sub && sub.status !== 'free' && sub.status !== 'canceled';

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginBottom: 6 }}>
        <BrandTitle size={20}>Profile</BrandTitle>
      </View>

      <SectionLabel>Account</SectionLabel>
      <Card>
        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: INK.ink }}>
          {user?.fullName || email || 'Signed in'}
        </Text>
        {email ? (
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: INK.inkDim, marginTop: 2 }}>{email}</Text>
        ) : null}
      </Card>

      <SectionLabel>Subscription</SectionLabel>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: INK.ink }}>{tierLabel(sub)}</Text>
            {sub?.currentPeriodEnd ? (
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: INK.inkDim, marginTop: 2 }}>
                Renews {new Date(sub.currentPeriodEnd).toLocaleDateString()}
              </Text>
            ) : null}
          </View>
          {isPaid ? <GhostButton title="Manage" small onPress={openPortal} /> : null}
        </View>
        {!isPaid ? (
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: INK.inkSoft, marginTop: 10 }}>
            Subscriptions are managed on the PsychPro website. Your plan syncs here automatically.
          </Text>
        ) : null}
        {usage && !isPaid ? (
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: INK.inkDim, marginTop: 8 }}>
            Free usage: {usage.usageCount}/{usage.freeLimit}
          </Text>
        ) : null}
      </Card>

      <SectionLabel>Study</SectionLabel>
      <View style={{ gap: 10 }}>
        <GhostButton title="Progress Overview" onPress={() => router.push('/progress')} />
        <GhostButton title="Leaderboard" onPress={() => router.push('/leaderboard')} />
      </View>

      <SectionLabel>Session</SectionLabel>
      <ChromeButton title="Sign Out" onPress={() => signOut()} />
    </Screen>
  );
}
