import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useGetTopics, type Topic } from '@workspace/api-client-react';
import { isEpppTopic } from '@/lib/eppp-content';
import { Screen, BrandTitle, SectionLabel, Card, GhostButton, LoadingView, ErrorView, INK } from '@/components/ui';

export default function CoursesScreen() {
  const router = useRouter();
  const { data: topics, isLoading, isError, refetch } = useGetTopics();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const grouped = useMemo(() => {
    const map = new Map<string, Topic[]>();
    for (const t of topics ?? []) {
      if (isEpppTopic(t)) continue; // EPPP content lives in the EPPP tab
      const list = map.get(t.category) ?? [];
      list.push(t);
      map.set(t.category, list);
    }
    return [...map.entries()];
  }, [topics]);

  if (isLoading) return <LoadingView />;
  if (isError || !topics) return <ErrorView onRetry={() => refetch()} />;

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginBottom: 6 }}>
        <BrandTitle size={20}>Courses</BrandTitle>
      </View>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: INK.inkDim, textAlign: 'center' }}>
        {grouped.length} courses · {grouped.reduce((n, [, l]) => n + l.length, 0)} lessons
      </Text>

      <SectionLabel>All Courses</SectionLabel>
      {grouped.map(([category, list]) => {
        const open = openCategory === category;
        return (
          <Card key={category} style={{ marginBottom: 10, padding: 0 }}>
            <Pressable
              onPress={() => setOpenCategory(open ? null : category)}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: INK.ink }}>{category}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: INK.inkDim, marginTop: 2 }}>
                  {list.length} lesson{list.length === 1 ? '' : 's'}
                </Text>
              </View>
              <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color={INK.inkDim} />
            </Pressable>
            {open ? (
              <View style={{ borderTopWidth: 1, borderTopColor: '#eef0f2', paddingHorizontal: 16, paddingBottom: 14 }}>
                {list.map((t) => (
                  <Pressable
                    key={t.id}
                    onPress={() => router.push(`/topic/${t.id}`)}
                    style={({ pressed }) => ({
                      paddingVertical: 12,
                      borderBottomWidth: 1,
                      borderBottomColor: '#f5f6f7',
                      opacity: pressed ? 0.6 : 1,
                    })}
                  >
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: INK.ink }}>{t.name}</Text>
                    <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: INK.inkDim, marginTop: 2 }}>
                      {t.flashcardCount} cards · {t.quizCount} quiz questions
                    </Text>
                  </Pressable>
                ))}
                <GhostButton
                  title="Course Mastery Exam"
                  small
                  style={{ marginTop: 12 }}
                  onPress={() => router.push(`/mastery/${encodeURIComponent(category)}`)}
                />
              </View>
            ) : null}
          </Card>
        );
      })}
    </Screen>
  );
}
