import React from 'react';
import { Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { useGetDashboardSummary } from '@workspace/api-client-react';
import {
  Screen,
  BrandTitle,
  SectionLabel,
  Card,
  StatTile,
  ProgressBar,
  GhostButton,
  LoadingView,
  ErrorView,
  INK,
} from '@/components/ui';

const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { data, isLoading, isError, refetch } = useGetDashboardSummary();

  if (isLoading) return <LoadingView />;
  if (isError || !data) return <ErrorView onRetry={() => refetch()} />;

  const firstName = user?.firstName ?? '';

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginBottom: 6 }}>
        <BrandTitle size={20}>PsychPro</BrandTitle>
      </View>
      {firstName ? (
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: INK.inkDim, textAlign: 'center' }}>
          Welcome back, {firstName}
        </Text>
      ) : null}

      <SectionLabel>Your Progress</SectionLabel>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <StatTile label="Day Streak" value={data.currentStreak} />
        <StatTile label="Avg Score" value={`${Math.round(data.averageScore)}%`} />
        <StatTile label="Topics" value={`${data.topicsStudied}/${data.totalTopics}`} />
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <StatTile label="Quizzes Done" value={data.quizzesCompleted} />
        <StatTile label="Exams Done" value={data.examsCompleted} />
        <StatTile label="Completed" value={data.topicsCompleted} />
      </View>

      <SectionLabel>This Week</SectionLabel>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {data.weeklyActivity.map((d, i) => (
            <View key={d.date} style={{ alignItems: 'center', gap: 6 }}>
              <View
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: d.active ? INK.cyan : '#eef0f2',
                  borderWidth: 1,
                  borderColor: d.active ? INK.cyan : '#e2e5e8',
                }}
              />
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: INK.inkDim }}>{DAY_LABELS[i]}</Text>
            </View>
          ))}
        </View>
      </Card>

      {data.recentTopics.length > 0 ? (
        <>
          <SectionLabel>Continue Studying</SectionLabel>
          {data.recentTopics.slice(0, 5).map((t) => (
            <Card key={t.id} style={{ marginBottom: 10 }} onPress={() => router.push(`/topic/${t.topicId}`)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: INK.ink, flex: 1 }} numberOfLines={1}>
                  {t.topicName}
                </Text>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: INK.cyan }}>{t.score}%</Text>
              </View>
              <ProgressBar pct={t.score} />
            </Card>
          ))}
        </>
      ) : null}

      {data.weakAreas.length > 0 ? (
        <>
          <SectionLabel>Needs Work</SectionLabel>
          {data.weakAreas.slice(0, 3).map((t) => (
            <Card key={t.id} style={{ marginBottom: 10 }} onPress={() => router.push(`/topic/${t.topicId}`)}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: INK.ink, flex: 1 }} numberOfLines={1}>
                  {t.topicName}
                </Text>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#b91c1c' }}>{t.score}%</Text>
              </View>
              <ProgressBar pct={t.score} />
            </Card>
          ))}
        </>
      ) : null}

      <SectionLabel>More</SectionLabel>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <GhostButton title="Full Progress" small style={{ flex: 1 }} onPress={() => router.push('/progress')} />
        <GhostButton title="Leaderboard" small style={{ flex: 1 }} onPress={() => router.push('/leaderboard')} />
      </View>
    </Screen>
  );
}
