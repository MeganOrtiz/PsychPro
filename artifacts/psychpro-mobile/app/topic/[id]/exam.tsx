import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetPracticeExamByTopic,
  useRecordExamAttempt,
  useUpdateTopicProgress,
  type QuizQuestion,
} from '@workspace/api-client-react';
import { Screen, Card, ChromeButton, GhostButton, ProgressBar, LoadingView, ErrorView, INK } from '@/components/ui';

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const;
type OptionKey = (typeof OPTION_KEYS)[number];

function optionText(q: QuizQuestion, key: OptionKey) {
  return key === 'A' ? q.optionA : key === 'B' ? q.optionB : key === 'C' ? q.optionC : q.optionD;
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function PracticeExamScreen() {
  const { id, full } = useLocalSearchParams<{ id: string; full?: string }>();
  const topicId = Number(id);
  const router = useRouter();
  const queryClient = useQueryClient();
  // Full-length mode requests a high count so the server returns every linked
  // question (it clamps to the available pool) — mirrors the web app.
  const { data: exam, isLoading, isError, error, refetch } = useGetPracticeExamByTopic(
    topicId,
    full ? { count: 250 } : undefined,
  );
  const recordAttempt = useRecordExamAttempt();
  const updateProgress = useUpdateTopicProgress();

  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, OptionKey>>({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const savedRef = useRef(false);
  const finishRef = useRef<() => void>(() => {});

  const qs = exam?.questions ?? [];

  const finish = async () => {
    if (savedRef.current) return;
    savedRef.current = true;
    setFinished(true);
    const missedQuestionIds = qs.filter((q) => answers[q.id] !== q.correctAnswer).map((q) => q.id);
    const correct = qs.length - missedQuestionIds.length;
    const percent = qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0;
    try {
      await updateProgress.mutateAsync({ topicId, data: { score: percent } });
      await recordAttempt.mutateAsync({ data: { topicId, score: correct, total: qs.length, missedQuestionIds } });
    } catch {
      // non-blocking
    }
    queryClient.invalidateQueries();
  };
  finishRef.current = finish;

  useEffect(() => {
    if (!started || finished || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      finishRef.current();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [started, finished, secondsLeft]);

  if (isLoading) return <LoadingView />;
  if (isError || !exam) return <ErrorView message="No practice exam for this topic yet." error={error} onRetry={() => refetch()} />;
  if (qs.length === 0) return <ErrorView message="This exam has no questions yet." />;

  if (!started) {
    return (
      <>
        <Stack.Screen options={{ title: exam.title || 'Practice Exam', headerShown: true }} />
        <Screen scroll={false} style={{ justifyContent: 'center' }}>
          <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 18, color: INK.ink, textAlign: 'center' }}>
              {exam.title || 'Practice Exam'}
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: INK.inkSoft, marginTop: 8, textAlign: 'center' }}>
              {qs.length} questions{exam.timeLimit ? ` · ${Math.round(exam.timeLimit / 60)} minute limit` : ' · untimed'}
            </Text>
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: INK.inkDim, marginTop: 4 }}>
              Score 90%+ to pass
            </Text>
          </Card>
          <ChromeButton
            title="Start Exam"
            style={{ marginTop: 16 }}
            onPress={() => {
              setStarted(true);
              if (exam.timeLimit) setSecondsLeft(exam.timeLimit);
            }}
          />
        </Screen>
      </>
    );
  }

  if (finished) {
    const missed = qs.filter((q) => answers[q.id] !== q.correctAnswer);
    const correct = qs.length - missed.length;
    const percent = Math.round((correct / qs.length) * 100);
    return (
      <>
        <Stack.Screen options={{ title: 'Results', headerShown: true }} />
        <Screen>
          <Card style={{ alignItems: 'center', paddingVertical: 28 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 36, color: percent >= 90 ? '#15803d' : INK.ink }}>
              {percent}%
            </Text>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: INK.inkSoft, marginTop: 6 }}>
              {correct} of {qs.length} correct · {percent >= 90 ? 'Passed' : 'Below the 90% pass mark'}
            </Text>
          </Card>

          {missed.length > 0 ? (
            <>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: INK.ink, marginTop: 22, marginBottom: 10 }}>
                Review missed questions
              </Text>
              {missed.map((q) => (
                <Card key={q.id} style={{ marginBottom: 10 }}>
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: INK.ink }}>{q.question}</Text>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#b91c1c', marginTop: 6 }}>
                    Your answer: {answers[q.id] ? optionText(q, answers[q.id]) : '—'}
                  </Text>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: '#15803d', marginTop: 2 }}>
                    Correct: {optionText(q, q.correctAnswer as OptionKey)}
                  </Text>
                  {q.explanation ? (
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, color: INK.inkSoft, marginTop: 6 }}>
                      {q.explanation}
                    </Text>
                  ) : null}
                </Card>
              ))}
            </>
          ) : null}

          <GhostButton title="Back to Topic" style={{ marginTop: 12 }} onPress={() => router.back()} />
        </Screen>
      </>
    );
  }

  const q = qs[index];
  const picked = answers[q.id];

  return (
    <>
      <Stack.Screen options={{ title: exam.title || 'Practice Exam', headerShown: true }} />
      <Screen>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: INK.inkDim }}>
            Question {index + 1} of {qs.length}
          </Text>
          {secondsLeft !== null ? (
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: secondsLeft < 60 ? '#b91c1c' : INK.cyan }}>
              {fmtTime(secondsLeft)}
            </Text>
          ) : null}
        </View>
        <ProgressBar pct={(index / qs.length) * 100} height={6} />

        <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 16, lineHeight: 23, color: INK.ink, marginTop: 14 }}>
          {q.question}
        </Text>

        <View style={{ marginTop: 16, gap: 10 }}>
          {OPTION_KEYS.map((key) => {
            const chosen = picked === key;
            return (
              <Pressable
                key={key}
                onPress={() => setAnswers((a) => ({ ...a, [q.id]: key }))}
                style={{
                  borderWidth: 1.5,
                  borderColor: chosen ? INK.ink : '#e2e5e8',
                  backgroundColor: chosen ? '#f4f5f6' : '#ffffff',
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

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
          <GhostButton title="Back" style={{ flex: 1 }} onPress={() => setIndex(Math.max(0, index - 1))} />
          {index + 1 >= qs.length ? (
            <ChromeButton title="Submit Exam" style={{ flex: 1 }} onPress={finish} />
          ) : (
            <ChromeButton title="Next" style={{ flex: 1 }} onPress={() => setIndex(index + 1)} />
          )}
        </View>
      </Screen>
    </>
  );
}
