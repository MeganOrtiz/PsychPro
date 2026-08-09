import React from 'react';
import { Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { useGetLeaderboard } from '@workspace/api-client-react';
import { Screen, Card, LoadingView, ErrorView, INK } from '@/components/ui';

export default function LeaderboardScreen() {
  const { data, isLoading, isError, refetch } = useGetLeaderboard();

  if (isLoading) return <LoadingView />;
  if (isError || !data) return <ErrorView onRetry={() => refetch()} />;

  return (
    <>
      <Stack.Screen options={{ title: 'Leaderboard', headerShown: true }} />
      <Screen>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: INK.inkDim, textAlign: 'center', marginBottom: 14 }}>
          {data.totalParticipants} learners this week
        </Text>
        {data.entries.map((e) => (
          <Card
            key={`${e.rank}-${e.displayName}`}
            style={{
              marginBottom: 8,
              paddingVertical: 12,
              borderColor: e.isCurrentUser ? INK.cyan : '#e2e5e8',
              borderWidth: e.isCurrentUser ? 1.5 : 1,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: e.rank <= 3 ? INK.cyan : INK.inkDim, width: 28 }}>
                {e.rank}
              </Text>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: INK.ink, flex: 1 }} numberOfLines={1}>
                {e.displayName}
                {e.isCurrentUser ? ' (you)' : ''}
              </Text>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: INK.inkSoft }}>
                {e.streak}d streak · {e.topicsCompleted} topics
              </Text>
            </View>
          </Card>
        ))}
        {data.currentUser && !data.entries.some((e) => e.isCurrentUser) ? (
          <Card style={{ marginTop: 8, borderColor: INK.cyan, borderWidth: 1.5 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 15, color: INK.inkDim, width: 28 }}>
                {data.currentUser.rank}
              </Text>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: INK.ink, flex: 1 }}>
                {data.currentUser.displayName} (you)
              </Text>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: INK.inkSoft }}>
                {data.currentUser.streak}d · {data.currentUser.topicsCompleted} topics
              </Text>
            </View>
          </Card>
        ) : null}
      </Screen>
    </>
  );
}
