import React from 'react';
import { Text, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useGetUserProgress } from '@workspace/api-client-react';
import { Screen, Card, ProgressBar, LoadingView, ErrorView, INK } from '@/components/ui';

export default function ProgressScreen() {
  const router = useRouter();
  const { data: progress, isLoading, isError, refetch } = useGetUserProgress();

  if (isLoading) return <LoadingView />;
  if (isError || !progress) return <ErrorView onRetry={() => refetch()} />;

  const sorted = [...progress].sort((a, b) => new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime());

  return (
    <>
      <Stack.Screen options={{ title: 'Progress', headerShown: true }} />
      <Screen>
        {sorted.length === 0 ? (
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: INK.inkDim, textAlign: 'center', marginTop: 40 }}>
            No study activity yet — open a topic to get started.
          </Text>
        ) : (
          sorted.map((t) => (
            <Card key={t.id} style={{ marginBottom: 10 }} onPress={() => router.push(`/topic/${t.topicId}`)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: INK.ink, flex: 1 }} numberOfLines={1}>
                  {t.topicName}
                </Text>
                <Text
                  style={{
                    fontFamily: 'Inter_600SemiBold',
                    fontSize: 13,
                    color: t.score >= 90 ? '#15803d' : t.score >= 60 ? INK.cyan : '#b91c1c',
                  }}
                >
                  {t.score}%
                </Text>
              </View>
              <ProgressBar pct={t.score} />
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: INK.inkDim, marginTop: 6 }}>
                Last studied {new Date(t.lastAccessed).toLocaleDateString()}
              </Text>
            </Card>
          ))
        )}
      </Screen>
    </>
  );
}
