import React from 'react';
import { Text } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useGetStudyGuideByTopic } from '@workspace/api-client-react';
import { Screen, LoadingView, ErrorView, INK } from '@/components/ui';

/** Minimal markdown-ish renderer: headings (#, ##, ###), bullets (-, *), bold stripped. */
function renderLine(line: string, i: number) {
  const trimmed = line.trim();
  const clean = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\*(.+?)\*/g, '$1');
  if (/^###\s/.test(trimmed)) {
    return (
      <Text key={i} style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: INK.ink, marginTop: 14, marginBottom: 4 }}>
        {clean(trimmed.replace(/^###\s*/, ''))}
      </Text>
    );
  }
  if (/^##\s/.test(trimmed)) {
    return (
      <Text key={i} style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: INK.ink, marginTop: 18, marginBottom: 6 }}>
        {clean(trimmed.replace(/^##\s*/, ''))}
      </Text>
    );
  }
  if (/^#\s/.test(trimmed)) {
    return (
      <Text key={i} style={{ fontFamily: 'Inter_700Bold', fontSize: 19, color: INK.ink, marginTop: 20, marginBottom: 8 }}>
        {clean(trimmed.replace(/^#\s*/, ''))}
      </Text>
    );
  }
  if (/^[-*]\s/.test(trimmed)) {
    return (
      <Text key={i} style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, color: INK.inkSoft, marginLeft: 10, marginBottom: 3 }}>
        {'\u2022 '}
        {clean(trimmed.replace(/^[-*]\s*/, ''))}
      </Text>
    );
  }
  if (trimmed === '') return <Text key={i} style={{ height: 8 }} />;
  return (
    <Text key={i} style={{ fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 21, color: INK.inkSoft, marginBottom: 3 }}>
      {clean(trimmed)}
    </Text>
  );
}

export default function StudyGuideScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topicId = Number(id);
  const { data: guide, isLoading, isError, error, refetch } = useGetStudyGuideByTopic(topicId);

  if (isLoading) return <LoadingView />;
  if (isError || !guide) return <ErrorView message="No study guide for this topic yet." error={error} onRetry={() => refetch()} />;

  return (
    <>
      <Stack.Screen options={{ title: guide.title || 'Study Guide', headerShown: true }} />
      <Screen>{guide.content.split('\n').map(renderLine)}</Screen>
    </>
  );
}
