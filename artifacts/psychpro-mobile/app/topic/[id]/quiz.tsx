import React, { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetQuizzesByTopic,
  useRecordQuizAttempt,
  useUpdateTopicProgress,
  type QuizQuestion,
} from '@workspace/api-client-react';
import { Screen, Card, ChromeButton, GhostButton, ProgressBar, LoadingView, ErrorView, INK } from '@/components/ui';

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const;
type OptionKey = (typeof OPTION_KEYS)[number];

export function optionText(q: QuizQuestion, key: OptionKey) {
  return key === 'A' ? q.optionA : key === 'B' ? q.optionB : key === 'C' ? q.optionC : q.optionD;
}

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topicId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: questions, isLoading, isError, error, refetch } = useGetQuizzesByTopic(topicId);
  const recordAttempt = useRecordQuizAttempt();
  const updateProgress = useUpdateTopicProgress();

  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<OptionKey | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const missedIdsRef = useRef<number[]>([]);
  const savedRef = useRef(false);

  if (isLoading) return <LoadingView />;
  if (isError || !questions) return <ErrorView error={error} onRetry={() => refetch()} />;
  if (questions.length === 0) return <ErrorView message="No quiz questions for this topic yet." />;

  const q = questions[Math.min(index, questions.length - 1)];

  const finish = async (finalCorrect: number) => {
    setFinished(true);
    if (savedRef.current) return;
    savedRef.current = true;
    const total = questions.length;
    const percent = Math.round((finalCorrect / total) * 100);
    try {
      await updateProgress.mutateAsync({ topicId, data: { score: percent } });
      await recordAttempt.mutateAsync({
        data: { topicId, score: finalCorrect, total, missedQuestionIds: missedIdsRef.current },
      });
    } catch {
      // non-blocking — server enforces caps on the next attempt
    }
    queryClient.invalidateQueries();
  };

  const onNext = () => {
    const isCorrect = picked === q.correctAnswer;
    const nextCorrect = correctCount + (isCorrect ? 1 : 0);
    if (!isCorrect) missedIdsRef.current.push(q.id);
    setCorrectCount(nextCorrect);
    setPicked(null);
    if (index + 1 >= questions.length) {
      finish(nextCorrect);
    } else {
      setIndex(index + 1);
    }
  };

  if (finished) {
    const percent = Math.round((correctCount / questions.length) * 100);
    return (
      <>
        <Stack.Screen options={{ title: 'Quiz', headerShown: true }} />
        <Screen scroll={false} style={{ justifyContent: 'center' }}>
          <Card style={{ alignItems: 'center', paddingVertical: 30 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 34, color: percent >= 90 ? '#15803d' : INK.ink }}>
              {percent}%
            </Text>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: INK.inkSoft, marginTop: 6 }}>
              {correctCount} of {questions.length} correct
            </Text>
          </Card>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <GhostButton title="Back to Topic" style={{ flex: 1 }} onPress={() => router.back()} />
            <ChromeButton
              title="Retry"
              style={{ flex: 1 }}
              onPress={() => {
                setIndex(0);
                setPicked(null);
                setCorrectCount(0);
                setFinished(false);
                missedIdsRef.current = [];
                savedRef.current = false;
              }}
            />
          </View>
        </Screen>
      </>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Quiz', headerShown: true }} />
      <Screen>
        <ProgressBar pct={(index / questions.length) * 100} />
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: INK.inkDim, marginTop: 6 }}>
          Question {index + 1} of {questions.length}
        </Text>

        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, lineHeight: 23, color: INK.ink, marginTop: 14 }}>
          {q.question}
        </Text>

        <View style={{ marginTop: 16, gap: 10 }}>
          {OPTION_KEYS.map((key) => {
            const chosen = picked === key;
            const showState = picked !== null;
            const isCorrect = key === q.correctAnswer;
            const border = showState && isCorrect ? '#15803d' : chosen ? (isCorrect ? '#15803d' : '#b91c1c') : '#e2e5e8';
            const bg = showState && isCorrect ? '#f0faf4' : chosen && !isCorrect ? '#fdf1f1' : '#ffffff';
            return (
              <Pressable
                key={key}
                disabled={picked !== null}
                onPress={() => setPicked(key)}
                style={{
                  borderWidth: 1.5,
                  borderColor: border,
                  backgroundColor: bg,
                  borderRadius: 12,
                  padding: 14,
                  flexDirection: 'row',
                  gap: 10,
                }}
              >
                <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 14, color: INK.inkDim }}>{key}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 20, color: INK.ink, flex: 1 }}>
                  {optionText(q, key)}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {picked !== null ? (
          <>
            <Card style={{ marginTop: 16, backgroundColor: '#f8f9fa' }}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: picked === q.correctAnswer ? '#15803d' : '#b91c1c' }}>
                {picked === q.correctAnswer ? 'Correct' : `Incorrect — the answer is ${q.correctAnswer}`}
              </Text>
              {q.explanation ? (
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, color: INK.inkSoft, marginTop: 6 }}>
                  {q.explanation}
                </Text>
              ) : null}
            </Card>
            <ChromeButton
              title={index + 1 >= questions.length ? 'Finish' : 'Next Question'}
              style={{ marginTop: 16 }}
              onPress={onNext}
            />
          </>
        ) : null}
      </Screen>
    </>
  );
}
