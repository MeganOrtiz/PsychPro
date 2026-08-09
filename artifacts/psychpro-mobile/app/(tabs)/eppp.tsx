import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useGetTopics, useGetEpppStudyPlan, type Topic } from '@workspace/api-client-react';
import {
  isEpppTopic,
  isEpppKnowledgeTopic,
  groupEpppTopicsByCategory,
  getEpppDisplayCategory,
  groupEpppClinicalCases,
  isEpppClinicalCase,
  isEpppFullLengthExam,
  isEpppRapidReview,
  groupEpppRapidReview,
} from '@/lib/eppp-content';
import { Screen, BrandTitle, SectionLabel, Card, GhostButton, LoadingView, ErrorView, INK } from '@/components/ui';

type Section = 'domains' | 'cases' | 'rapid' | 'exams';

export default function EpppScreen() {
  const router = useRouter();
  const { data: topics, isLoading, isError, refetch } = useGetTopics();
  const { data: plan } = useGetEpppStudyPlan();
  const [section, setSection] = useState<Section>('domains');
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const eppp = useMemo(() => (topics ?? []).filter(isEpppTopic), [topics]);
  const knowledge = useMemo(() => eppp.filter(isEpppKnowledgeTopic), [eppp]);
  const domains = useMemo(() => groupEpppTopicsByCategory(knowledge), [knowledge]);
  const cases = useMemo(() => groupEpppClinicalCases(eppp.filter(isEpppClinicalCase)), [eppp]);
  const rapid = useMemo(() => groupEpppRapidReview(eppp.filter(isEpppRapidReview)), [eppp]);
  const fullExams = useMemo(() => eppp.filter(isEpppFullLengthExam), [eppp]);

  if (isLoading) return <LoadingView />;
  if (isError || !topics) return <ErrorView onRetry={() => refetch()} />;

  const daysUntilExam =
    plan?.saved && plan.examDate
      ? Math.max(0, Math.ceil((new Date(plan.examDate).getTime() - Date.now()) / 86_400_000))
      : null;

  const tabs: { key: Section; label: string }[] = [
    { key: 'domains', label: 'Domains' },
    { key: 'cases', label: 'Clinical Cases' },
    { key: 'rapid', label: 'Rapid Review' },
    { key: 'exams', label: 'Full Exams' },
  ];

  const renderGroups = (groups: { label: string; topics: Topic[] }[]) => (
    <>
      {groups.map(({ label, topics: list }) => {
        const open = openGroup === label;
        return (
          <Card key={label} style={{ marginBottom: 10, padding: 0 }}>
            <Pressable
              onPress={() => setOpenGroup(open ? null : label)}
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: INK.ink }}>{label}</Text>
                <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: INK.inkDim, marginTop: 2 }}>
                  {list.length} item{list.length === 1 ? '' : 's'}
                </Text>
              </View>
              <Feather name={open ? 'chevron-up' : 'chevron-down'} size={18} color={INK.inkDim} />
            </Pressable>
            {open ? (
              <View style={{ borderTopWidth: 1, borderTopColor: '#eef0f2', paddingHorizontal: 16, paddingBottom: 10 }}>
                {list.map((t) => (
                  <Pressable
                    key={t.id}
                    onPress={() => router.push(`/topic/${t.id}`)}
                    style={({ pressed }) => ({ paddingVertical: 12, opacity: pressed ? 0.6 : 1 })}
                  >
                    <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 14, color: INK.ink }}>{t.name}</Text>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </Card>
        );
      })}
    </>
  );

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginBottom: 6 }}>
        <BrandTitle size={20}>EPPP Mastery</BrandTitle>
      </View>
      {daysUntilExam !== null ? (
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 13, color: INK.cyan, textAlign: 'center' }}>
          {daysUntilExam} days until your exam
        </Text>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 8, marginTop: 18 }}>
        <GhostButton title="Study Plan" small style={{ flex: 1 }} onPress={() => router.push('/eppp/study-plan')} />
        <GhostButton title="Missed Questions" small style={{ flex: 1 }} onPress={() => router.push('/eppp/missed')} />
      </View>

      <View style={{ flexDirection: 'row', gap: 6, marginTop: 20, flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => {
              setSection(t.key);
              setOpenGroup(null);
            }}
            style={{
              paddingVertical: 7,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: section === t.key ? INK.ink : '#c8d2d6',
              backgroundColor: section === t.key ? INK.ink : '#ffffff',
            }}
          >
            <Text
              style={{
                fontFamily: 'Inter_600SemiBold',
                fontSize: 12,
                color: section === t.key ? '#ffffff' : INK.inkSoft,
              }}
            >
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionLabel>
        {section === 'domains'
          ? 'Knowledge Domains'
          : section === 'cases'
            ? 'Clinical Integration Cases'
            : section === 'rapid'
              ? 'Rapid Review'
              : 'Full-Length Exams'}
      </SectionLabel>

      {section === 'domains' ? renderGroups(domains.map((g) => ({ label: g.name, topics: g.items }))) : null}
      {section === 'cases' ? renderGroups(cases.map((g) => ({ label: g.name, topics: g.items }))) : null}
      {section === 'rapid' ? renderGroups(rapid.map((g) => ({ label: g.name, topics: g.items }))) : null}
      {section === 'exams' ? (
        <>
          {fullExams.map((t) => (
            <Card key={t.id} style={{ marginBottom: 10 }} onPress={() => router.push(`/topic/${t.id}/exam?full=1`)}>
              <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: INK.ink }}>
                {getEpppDisplayCategory(t) || t.name}
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: INK.inkDim, marginTop: 2 }}>
                {t.name} · {t.examQuestionCount ?? t.quizCount} questions
              </Text>
            </Card>
          ))}
          {fullExams.length === 0 ? (
            <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: INK.inkDim }}>
              No full-length exams available yet.
            </Text>
          ) : null}
        </>
      ) : null}
    </Screen>
  );
}
