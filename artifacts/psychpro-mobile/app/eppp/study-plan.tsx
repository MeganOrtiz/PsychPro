import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import { useGetTopics, useGetEpppStudyPlan, usePutEpppStudyPlan } from '@workspace/api-client-react';
import { isEpppKnowledgeTopic, isEpppTopic, getEpppDisplayCategory } from '@/lib/eppp-content';
import { Screen, Card, ChromeButton, LoadingView, ErrorView, SectionLabel, INK } from '@/components/ui';

export default function EpppStudyPlanScreen() {
  const queryClient = useQueryClient();
  const { data: topics, isLoading: tLoading } = useGetTopics();
  const { data: plan, isLoading: pLoading, isError, refetch } = useGetEpppStudyPlan();
  const save = usePutEpppStudyPlan();

  const [examDate, setExamDate] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState(4);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [hydrated, setHydrated] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    if (plan && !hydrated) {
      setExamDate(plan.examDate ?? '');
      setDaysPerWeek(plan.daysPerWeek || 4);
      setSelected(new Set(plan.selectedTopicIds));
      setHydrated(true);
    }
  }, [plan, hydrated]);

  const knowledge = useMemo(
    () => (topics ?? []).filter((t) => isEpppTopic(t) && isEpppKnowledgeTopic(t)),
    [topics],
  );

  if (tLoading || pLoading) return <LoadingView />;
  if (isError) return <ErrorView onRetry={() => refetch()} />;

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onSave = async () => {
    try {
      await save.mutateAsync({
        data: { examDate: examDate.trim(), selectedTopicIds: [...selected], daysPerWeek },
      });
      queryClient.invalidateQueries();
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch {
      // surfaced via button state
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'EPPP Study Plan', headerShown: true }} />
      <Screen>
        <SectionLabel>Exam Date</SectionLabel>
        <TextInput
          value={examDate}
          onChangeText={setExamDate}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={INK.inkDim}
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: '#c8d2d6',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            fontFamily: 'Inter_400Regular',
            color: INK.ink,
            backgroundColor: '#ffffff',
          }}
        />

        <SectionLabel>Study Days Per Week</SectionLabel>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <Pressable
              key={n}
              onPress={() => setDaysPerWeek(n)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                borderWidth: 1,
                alignItems: 'center',
                borderColor: daysPerWeek === n ? INK.ink : '#c8d2d6',
                backgroundColor: daysPerWeek === n ? INK.ink : '#ffffff',
              }}
            >
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: daysPerWeek === n ? '#fff' : INK.inkSoft }}>
                {n}
              </Text>
            </Pressable>
          ))}
        </View>

        <SectionLabel>Topics In Your Plan</SectionLabel>
        <Card style={{ padding: 0 }}>
          {knowledge.map((t, i) => {
            const on = selected.has(t.id);
            return (
              <Pressable
                key={t.id}
                onPress={() => toggle(t.id)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  borderTopWidth: i === 0 ? 0 : 1,
                  borderTopColor: '#f0f2f3',
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    borderWidth: 1.5,
                    marginRight: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderColor: on ? INK.cyan : '#c8d2d6',
                    backgroundColor: on ? INK.cyan : '#ffffff',
                  }}
                >
                  {on ? <Feather name="check" size={13} color="#fff" /> : null}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: INK.ink }} numberOfLines={1}>
                    {t.name}
                  </Text>
                  <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: INK.inkDim }} numberOfLines={1}>
                    {getEpppDisplayCategory(t)}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </Card>

        {savedMsg ? (
          <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 13, color: '#15803d', textAlign: 'center', marginTop: 14 }}>
            Study plan saved
          </Text>
        ) : null}
        <ChromeButton title="Save Study Plan" loading={save.isPending} style={{ marginTop: 14 }} onPress={onSave} />
      </Screen>
    </>
  );
}
