import React, { useMemo, useState } from 'react';
import { Image, ImageSourcePropType, LayoutChangeEvent, Pressable, ScrollView, Text, View } from 'react-native';
import { Screen, BrandTitle, Card, INK } from '@/components/ui';
import { HOTSPOTS, type ViewKey } from '@/data/brain-hotspots';
import { BRAIN_STRUCTURES, type BrainStructure } from '@/data/brain-structures';

const VIEW_IMAGES: Record<ViewKey, ImageSourcePropType> = {
  lateral: require('@/assets/brain-views/lateral.webp'),
  medial: require('@/assets/brain-views/medial.webp'),
  midsagittal: require('@/assets/brain-views/midsagittal.webp'),
  coronal: require('@/assets/brain-views/coronal.webp'),
  dorsal: require('@/assets/brain-views/dorsal.webp'),
  ventral: require('@/assets/brain-views/ventral.webp'),
  ventralNerves: require('@/assets/brain-views/ventral-nerves.webp'),
};

// Display labels mirror the web Brain Lab (internal keys kept in sync).
const VIEW_LABELS: Record<ViewKey, string> = {
  lateral: 'Lateral',
  medial: 'Midsagittal',
  midsagittal: 'Sagittal',
  coronal: 'Coronal',
  dorsal: 'Dorsal',
  ventral: 'Ventral',
  ventralNerves: 'Cranial Nerves',
};

const VIEW_KEYS: ViewKey[] = ['lateral', 'medial', 'midsagittal', 'coronal', 'dorsal', 'ventral', 'ventralNerves'];

export default function BrainLabScreen() {
  const [view, setView] = useState<ViewKey>('lateral');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [boxWidth, setBoxWidth] = useState(0);

  const structureById = useMemo(() => {
    const map = new Map<string, BrainStructure>();
    for (const s of BRAIN_STRUCTURES) map.set(s.id, s);
    return map;
  }, []);

  const hotspots = HOTSPOTS[view] ?? [];
  const selected = selectedId ? structureById.get(selectedId) : null;

  const onLayout = (e: LayoutChangeEvent) => setBoxWidth(e.nativeEvent.layout.width);

  return (
    <Screen>
      <View style={{ alignItems: 'center', marginBottom: 14 }}>
        <BrandTitle size={20}>Brain Lab</BrandTitle>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingBottom: 4 }}>
        {VIEW_KEYS.map((k) => (
          <Pressable
            key={k}
            onPress={() => {
              setView(k);
              // Keep selection if visible on the new view; otherwise clear.
              if (selectedId && !(HOTSPOTS[k] ?? []).some((h) => h.id === selectedId)) setSelectedId(null);
            }}
            style={{
              paddingVertical: 7,
              paddingHorizontal: 12,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: view === k ? INK.ink : '#c8d2d6',
              backgroundColor: view === k ? INK.ink : '#ffffff',
            }}
          >
            <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 12, color: view === k ? '#fff' : INK.inkSoft }}>
              {VIEW_LABELS[k]}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View
        onLayout={onLayout}
        style={{ marginTop: 12, borderRadius: 14, borderWidth: 1, borderColor: '#e2e5e8', overflow: 'hidden', backgroundColor: '#fff' }}
      >
        <Image source={VIEW_IMAGES[view]} style={{ width: '100%', aspectRatio: 1 }} resizeMode="contain" />
        {boxWidth > 0
          ? hotspots.map((h) => {
              const active = selectedId === h.id;
              return (
                <Pressable
                  key={h.id}
                  onPress={() => setSelectedId(active ? null : h.id)}
                  hitSlop={8}
                  style={{
                    position: 'absolute',
                    left: `${h.x}%`,
                    top: `${h.y}%`,
                    marginLeft: -7,
                    marginTop: -7,
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: active ? INK.cyan : 'rgba(8,145,178,0.35)',
                    borderWidth: 1.5,
                    borderColor: active ? INK.cyan : 'rgba(8,145,178,0.8)',
                  }}
                />
              );
            })
          : null}
      </View>

      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 12, color: INK.inkDim, marginTop: 8, textAlign: 'center' }}>
        Tap a marker to identify the structure
      </Text>

      {selected ? (
        <Card style={{ marginTop: 14 }}>
          <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 17, color: INK.ink }}>{selected.name}</Text>
          <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 12, color: INK.cyan, marginTop: 2, textTransform: 'capitalize' }}>
            {selected.system.replace('-', ' ')} · {selected.category.replace('-', ' ')}
          </Text>
          {selected.overview ? <DetailBlock title="Overview" text={selected.overview} /> : null}
          {selected.functions.length > 0 ? (
            <DetailBlock title="Functions" text={selected.functions.map((f) => `• ${f}`).join('\n')} />
          ) : null}
          {selected.neuropsych.length > 0 ? (
            <DetailBlock title="Neuropsych" text={selected.neuropsych.map((f) => `• ${f}`).join('\n')} />
          ) : null}
          {selected.conditions.length > 0 ? (
            <DetailBlock title="Clinical Relevance" text={selected.conditions.map((f) => `• ${f}`).join('\n')} />
          ) : null}
        </Card>
      ) : (
        <Card style={{ marginTop: 14 }}>
          <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, color: INK.inkSoft }}>
            Explore the interactive atlas: switch views and tap any marker to read about that structure&apos;s anatomy,
            functions, and clinical relevance.
          </Text>
        </Card>
      )}
    </Screen>
  );
}

function DetailBlock({ title, text }: { title: string; text: string }) {
  return (
    <View style={{ marginTop: 12 }}>
      <Text
        style={{
          fontFamily: 'Montserrat_600SemiBold',
          fontSize: 11,
          letterSpacing: 1.5,
          textTransform: 'uppercase',
          color: INK.inkDim,
          marginBottom: 4,
        }}
      >
        {title}
      </Text>
      <Text style={{ fontFamily: 'Inter_400Regular', fontSize: 13, lineHeight: 19, color: INK.inkSoft }}>{text}</Text>
    </View>
  );
}
