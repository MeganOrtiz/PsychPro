import React from 'react';
import { Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useGetTopic, useGetTopicProgress } from '@workspace/api-client-react';
import { Screen, Card, ProgressBar, LoadingView, ErrorView, INK } from '@/components/ui';

export default function TopicHubScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topicId = Number(id);
  const router = useRouter();
  const { data: topic, isLoading, isError, refetch } = useGetTopic(topicId);
  const { data: progress } = useGetTopicProgress(topicId);

  if (isLoading) return <LoadingView />;
  if (isError || !topic) return <ErrorView onRetry={() => refetch()} />;

  const modes: { key: string; title: string; subtitle: string; icon: keyof typeof Feather.glyphMap; href: string }[] = [
    {
      key: 'flashcards',
      title: 'Flashcards',
      subtitle: `${topic.flashcardCount} cards`,
      icon: 'layers',
      href: `/topic/${topicId}/flashcards`,
    },
    {
      key: 'quiz',
      title: 'Quiz',
      subtitle: `${topic.quizCount} questions`,
      icon: 'check-circle',
      href: `/topic/${topicId}/quiz`,
    },
    {
      key: 'guide',
      title: 'Study Guide',
      subtitle: 'In-depth reading',
      icon: 'book-open',
      href: `/topic/${topicId}/guide`,
    },
    {
      key: 'exam',
      title: 'Practice Exam',
      subtitle: `${topic.examQuestionCount ?? topic.quizCount} questions · pass at 90%`,
      icon: 'award',
      href: `/topic/${topicId}/exam`,
    },
  ];

  return (
    <>
      <Stack.Screen options={{ title: topic.name, headerShown: true }} />
      <Screen>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, color: INK.ink }}>{topic.name}</Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: INK.inkDim, marginTop: 4 }}>
          {topic.category}
        </Text>
        {topic.description ? (
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: INK.inkSoft, marginTop: 10 }}>
            {topic.description}
          </Text>
        ) : null}

        {progress ? (
          <Card style={{ marginTop: 18 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: INK.ink }}>Best Score</Text>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: INK.cyan }}>{progress.score}%</Text>
            </View>
            <ProgressBar pct={progress.score} />
          </Card>
        ) : null}

        <View style={{ marginTop: 18, gap: 10 }}>
          {modes.map((m) => (
            <Card key={m.key} onPress={() => router.push(m.href as any)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#e0f4f9',
                  }}
                >
                  <Feather name={m.icon} size={20} color={INK.cyan} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: INK.ink }}>{m.title}</Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: INK.inkDim, marginTop: 2 }}>
                    {m.subtitle}
                  </Text>
                </View>
                <Feather name="chevron-right" size={18} color={INK.inkDim} />
              </View>
            </Card>
          ))}
        </View>
      </Screen>
    </>
  );
}
