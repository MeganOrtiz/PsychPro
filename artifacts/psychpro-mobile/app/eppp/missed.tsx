import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack } from 'expo-router';
import { useGetEpppMissedQuestions } from '@workspace/api-client-react';
import { Screen, Card, LoadingView, ErrorView, INK } from '@/components/ui';

export default function EpppMissedQuestionsScreen() {
  const { data, isLoading, isError, refetch } = useGetEpppMissedQuestions();
  const [openId, setOpenId] = useState<number | null>(null);

  if (isLoading) return <LoadingView />;
  if (isError || !data) return <ErrorView onRetry={() => refetch()} />;

  const questions = data.questions;

  return (
    <>
      <Stack.Screen options={{ title: 'Missed Questions', headerShown: true }} />
      <Screen>
        {questions.length === 0 ? (
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, color: INK.inkDim, textAlign: 'center', marginTop: 40 }}>
            No missed questions yet — they&apos;ll collect here as you take EPPP quizzes and exams.
          </Text>
        ) : (
          questions.map((q) => {
            const open = openId === q.id;
            const options: [string, string][] = [
              ['A', q.optionA],
              ['B', q.optionB],
              ['C', q.optionC],
              ['D', q.optionD],
            ];
            return (
              <Card key={q.id} style={{ marginBottom: 10, padding: 0 }}>
                <Pressable onPress={() => setOpenId(open ? null : q.id)} style={{ padding: 16 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: INK.cyan, flex: 1 }} numberOfLines={1}>
                      {q.topicName}
                    </Text>
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: INK.inkDim }}>
                      missed {q.timesMissed}×
                    </Text>
                  </View>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, lineHeight: 20, color: INK.ink }}>
                    {q.question}
                  </Text>
                </Pressable>
                {open ? (
                  <View style={{ borderTopWidth: 1, borderTopColor: '#eef0f2', padding: 16, gap: 8 }}>
                    {options.map(([key, text]) => (
                      <Text
                        key={key}
                        style={{
                          fontFamily: key === q.correctAnswer ? 'Inter_600SemiBold' : 'Inter_400Regular',
                          fontSize: 13,
                          lineHeight: 19,
                          color: key === q.correctAnswer ? '#15803d' : INK.inkSoft,
                        }}
                      >
                        {key}. {text}
                      </Text>
                    ))}
                    {q.explanation ? (
                      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, color: INK.inkSoft, marginTop: 6 }}>
                        {q.explanation}
                      </Text>
                    ) : null}
                  </View>
                ) : null}
              </Card>
            );
          })
        )}
      </Screen>
    </>
  );
}
