import React, { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, Text, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useGetFlashcardsByTopic } from '@workspace/api-client-react';
import { Screen, ChromeButton, GhostButton, ProgressBar, LoadingView, ErrorView, INK } from '@/components/ui';

export default function FlashcardsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topicId = Number(id);
  const { data: cards, isLoading, isError, error, refetch } = useGetFlashcardsByTopic(topicId);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const reduced = useRef(false);
  const rotation = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then(value => { if (active) reduced.current = value; });
    const listener = AccessibilityInfo.addEventListener('reduceMotionChanged', value => { reduced.current = value; });
    return () => {
      active = false;
      listener.remove();
      rotation.stopAnimation();
      slide.stopAnimation();
    };
  }, [rotation, slide]);

  function lock(value: boolean) {
    busyRef.current = value;
    setBusy(value);
  }

  function reveal() {
    if (busyRef.current) return;
    if (reduced.current) { setFlipped(f => !f); return; }
    lock(true);
    Animated.timing(rotation, { toValue: 1, duration: 150, useNativeDriver: true }).start(({ finished }) => {
      if (!finished) return;
      setFlipped(f => !f);
      rotation.setValue(-1);
      Animated.timing(rotation, { toValue: 0, duration: 150, useNativeDriver: true }).start(({ finished: complete }) => {
        if (complete) lock(false);
      });
    });
  }

  function move(target: number) {
    if (busyRef.current || target === index) return;
    const direction = target > index ? 1 : -1;
    if (reduced.current) {
      setIndex(target);
      setFlipped(false);
      return;
    }
    lock(true);
    Animated.timing(slide, { toValue: -direction * 80, duration: 180, useNativeDriver: true }).start(({ finished }) => {
      if (!finished) return;
      setIndex(target);
      setFlipped(false);
      rotation.setValue(0);
      slide.setValue(direction * 80);
      Animated.timing(slide, { toValue: 0, duration: 180, useNativeDriver: true }).start(({ finished: complete }) => {
        if (complete) lock(false);
      });
    });
  }

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
            <Animated.View style={{
              flex: 1, marginVertical: 20,
              opacity: slide.interpolate({ inputRange: [-80, 0, 80], outputRange: [0, 1, 0] }),
              transform: [
                { perspective: 1000 },
                { translateX: slide },
                { rotateY: rotation.interpolate({ inputRange: [-1, 0, 1], outputRange: ['-90deg', '0deg', '90deg'] }) },
              ],
            }}>
            <Pressable
              disabled={busy}
              accessibilityRole="button"
              accessibilityLabel={flipped ? 'Show question' : 'Reveal answer'}
              onPress={reveal}
              style={{
                flex: 1,
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
            </Animated.View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              <GhostButton
                title="Back"
                style={{ flex: 1 }}
                onPress={() => {
                  if (index > 0) move(index - 1);
                }}
              />
              <ChromeButton
                title="Next"
                style={{ flex: 1 }}
                onPress={() => {
                  move(index + 1);
                }}
              />
            </View>
          </>
        )}
      </Screen>
    </>
  );
}
