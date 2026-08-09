import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useGetFlashcardsByTopic } from '@workspace/api-client-react';
import { Screen, ChromeButton, GhostButton, ProgressBar, LoadingView, ErrorView, INK } from '@/components/ui';

export default function FlashcardsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topicId = Number(id);
  const { data: cards, isLoading, isError, error, refetch } = useGetFlashcardsByTopic(topicId);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (isLoading) return <LoadingView />;
  if (isError || !cards) return <ErrorView error={error} onRetry={() => refetch()} />;
  if (cards.length === 0) {
    return (
      <>
        <Stack.Screen options={{ title: 'Flashcards', headerShown: true }} />
        <ErrorView message="No flashcards for this topic yet." />
      </>
    );
  }

  const card = cards[Math.min(index, cards.length - 1)];
  const done = index >= cards.length;

  return (
    <>
      <Stack.Screen options={{ title: 'Flashcards', headerShown: true }} />
      <Screen scroll={false}>
        <ProgressBar pct={(Math.min(index, cards.length) / cards.length) * 100} />
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: INK.inkDim, marginTop: 6, textAlign: 'center' }}>
          {Math.min(index + 1, cards.length)} of {cards.length}
        </Text>

        {done ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 20, color: INK.ink }}>Deck complete</Text>
            <ChromeButton
              title="Start Over"
              onPress={() => {
                setIndex(0);
                setFlipped(false);
              }}
            />
          </View>
        ) : (
          <>
            <Pressable
              onPress={() => setFlipped((f) => !f)}
              style={{
                flex: 1,
                marginVertical: 20,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: flipped ? INK.cyan : '#e2e5e8',
                backgroundColor: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 24,
                shadowColor: '#000',
                shadowOpacity: 0.06,
                shadowRadius: 14,
                shadowOffset: { width: 0, height: 4 },
                elevation: 3,
              }}
            >
              <Text
                style={{
                  fontFamily: 'Montserrat_600SemiBold',
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  color: flipped ? INK.cyan : INK.inkDim,
                  marginBottom: 14,
                }}
              >
                {flipped ? 'Answer' : 'Question'}
              </Text>
              <Text
                style={{
                  fontFamily: 'Inter_500Medium',
                  fontSize: 17,
                  lineHeight: 25,
                  color: INK.ink,
                  textAlign: 'center',
                }}
              >
                {flipped ? card.answer : card.question}
              </Text>
              <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 11, color: INK.inkDim, marginTop: 18 }}>
                Tap to {flipped ? 'see question' : 'reveal answer'}
              </Text>
            </Pressable>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <GhostButton
                title="Back"
                style={{ flex: 1 }}
                onPress={() => {
                  if (index > 0) {
                    setIndex(index - 1);
                    setFlipped(false);
                  }
                }}
              />
              <ChromeButton
                title="Next"
                style={{ flex: 1 }}
                onPress={() => {
                  setIndex(index + 1);
                  setFlipped(false);
                }}
              />
            </View>
          </>
        )}
      </Screen>
    </>
  );
}
