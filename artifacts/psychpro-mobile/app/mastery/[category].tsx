import React, { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import {
  useGetCourseMasteryStatus,
  useGetCourseMasteryExam,
  useRecordCourseMasteryAttempt,
  type QuizQuestion,
} from '@workspace/api-client-react';
import { Screen, Card, ChromeButton, GhostButton, ProgressBar, LoadingView, ErrorView, INK } from '@/components/ui';

const OPTION_KEYS = ['A', 'B', 'C', 'D'] as const;
type OptionKey = (typeof OPTION_KEYS)[number];

function optionText(q: QuizQuestion, key: OptionKey) {
  return key === 'A' ? q.optionA : key === 'B' ? q.optionB : key === 'C' ? q.optionC : q.optionD;
}

export default function CourseMasteryScreen() {
  const { category: raw } = useLocalSearchParams<{ category: string }>();
  const category = decodeURIComponent(raw ?? '');
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: status, isLoading, isError, refetch } = useGetCourseMasteryStatus(category);
  const [taking, setTaking] = useState(false);

  if (isLoading) return <LoadingView />;
  if (isError || !status) return <ErrorView onRetry={() => refetch()} />;

  if (taking) {
    return <MasteryExam category={category} onExit={() => { setTaking(false); queryClient.invalidateQueries(); }} />;
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Course Mastery', headerShown: true }} />
      <Screen>
        <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 19, color: INK.ink }}>{category}</Text>
        <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: INK.inkDim, marginTop: 4 }}>
          Pass every lesson&apos;s practice exam at {status.passingScore}%+ to unlock the Course Mastery Exam.
        </Text>

        <Card style={{ marginTop: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: INK.ink }}>Lessons passed</Text>
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: INK.cyan }}>
              {status.passedTopics}/{status.totalTopics}
            </Text>
          </View>
          <ProgressBar pct={status.totalTopics > 0 ? (status.passedTopics / status.totalTopics) * 100 : 0} />
          {status.mastered ? (
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#15803d', marginTop: 10 }}>
              Course mastered{status.bestMasteryScore !== null ? ` · best score ${status.bestMasteryScore}%` : ''}
            </Text>
          ) : status.bestMasteryScore !== null ? (
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: INK.inkSoft, marginTop: 10 }}>
              Best mastery attempt: {status.bestMasteryScore}%
            </Text>
          ) : null}
        </Card>

        <View style={{ marginTop: 16, gap: 8 }}>
          {status.lessons.map((l) => (
            <Pressable
              key={l.topicId}
              onPress={() => router.push(`/topic/${l.topicId}`)}
              style={({ pressed }) => ({
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#e2e5e8',
                backgroundColor: '#ffffff',
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  marginRight: 12,
                  backgroundColor: l.passed ? '#22c55e' : '#e2e5e8',
                }}
              />
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: INK.ink, flex: 1 }} numberOfLines={1}>
                {l.name}
              </Text>
              <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: l.passed ? '#15803d' : INK.inkDim }}>
                {l.bestExamPct !== null ? `${l.bestExamPct}%` : '—'}
              </Text>
            </Pressable>
          ))}
        </View>

        <ChromeButton
          title={status.unlocked ? 'Start Course Mastery Exam' : 'Locked — pass all lessons first'}
          disabled={!status.unlocked}
          style={{ marginTop: 20 }}
          onPress={() => setTaking(true)}
        />
      </Screen>
    </>
  );
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

function MasteryExam({ category, onExit }: { category: string; onExit: () => void }) {
  const { data: exam, isLoading, isError, error, refetch } = useGetCourseMasteryExam(category);
  const record = useRecordCourseMasteryAttempt();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, OptionKey>>({});
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const savedRef = useRef(false);
  const finishRef = useRef<() => void>(() => {});

  // Server-provided time limit — enforced like the web app.
  const timeLimit = exam?.timeLimit ?? null;
  useEffect(() => {
    if (timeLimit && secondsLeft === null) setSecondsLeft(timeLimit);
  }, [timeLimit, secondsLeft]);

  useEffect(() => {
    if (finished || secondsLeft === null) return;
    if (secondsLeft <= 0) {
      finishRef.current();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => clearTimeout(t);
  }, [finished, secondsLeft]);

  if (isLoading) return <LoadingView />;
  if (isError || !exam) return <ErrorView error={error} onRetry={() => refetch()} />;
  const qs = exam.questions;
  if (qs.length === 0) return <ErrorView message="No questions available for this mastery exam." />;

  const finish = async () => {
    if (savedRef.current) return;
    savedRef.current = true;
    setFinished(true);
    const correct = qs.filter((q) => answers[q.id] === q.correctAnswer).length;
    const score = Math.round((correct / qs.length) * 100);
    try {
      await record.mutateAsync({ data: { category, score, correct, total: qs.length } });
    } catch {
      // non-blocking
    }
  };
  finishRef.current = finish;

  if (finished) {
    const correct = qs.filter((q) => answers[q.id] === q.correctAnswer).length;
    const percent = Math.round((correct / qs.length) * 100);
    const passed = percent >= exam.passingScore;
    return (
      <>
        <Stack.Screen options={{ title: 'Results', headerShown: true }} />
        <Screen scroll={false} style={{ justifyContent: 'center' }}>
          <Card style={{ alignItems: 'center', paddingVertical: 30 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 36, color: passed ? '#15803d' : INK.ink }}>{percent}%</Text>
            <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: INK.inkSoft, marginTop: 6 }}>
              {correct} of {qs.length} correct · {passed ? 'Course mastered!' : `Pass mark is ${exam.passingScore}%`}
            </Text>
          </Card>
          <ChromeButton title="Done" style={{ marginTop: 16 }} onPress={onExit} />
        </Screen>
      </>
    );
  }

  const q = qs[index];
  const picked = answers[q.id];

  return (
    <>
      <Stack.Screen options={{ title: exam.title || 'Mastery Exam', headerShown: true }} />
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
            <ChromeButton title="Submit" style={{ flex: 1 }} onPress={finish} />
          ) : (
            <ChromeButton title="Next" style={{ flex: 1 }} onPress={() => setIndex(index + 1)} />
          )}
        </View>
      </Screen>
    </>
  );
}
