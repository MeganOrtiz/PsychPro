import React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useColors } from '@/hooks/useColors';

const C = {
  ink: '#24282c',
  inkSoft: '#4b5157',
  inkDim: '#6b7278',
  border: '#e2e5e8',
  borderStrong: '#c8d2d6',
  chromeTop: '#f7f8f9',
  chromeBottom: '#dfe3e6',
  chromeBorder: '#c3c9ce',
  cyan: '#0891b2',
  white: '#ffffff',
};

/** Scrollable screen wrapper on the pure-white ground with web-preview insets. */
export function Screen({
  children,
  scroll = true,
  padded = true,
  style,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  style?: StyleProp<ViewStyle>;
}) {
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === 'web';
  const topPad = isWeb ? 16 : Math.max(insets.top, 12);
  const bottomPad = (isWeb ? 84 : Math.max(insets.bottom, 12) + 64) + 24;

  if (!scroll) {
    return (
      <View
        style={[
          { flex: 1, backgroundColor: C.white, paddingTop: topPad, paddingBottom: bottomPad },
          padded && { paddingHorizontal: 20 },
          style,
        ]}
      >
        {children}
      </View>
    );
  }
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: C.white }}
      contentContainerStyle={[
        { paddingTop: topPad, paddingBottom: bottomPad },
        padded && { paddingHorizontal: 20 },
        style,
      ]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
}

/** Montserrat wordmark-voice title (weight 200, wide tracking, uppercase). */
export function BrandTitle({ children, size = 22 }: { children: string; size?: number }) {
  return (
    <Text
      style={{
        fontFamily: 'Montserrat_200ExtraLight',
        fontSize: size,
        letterSpacing: size * 0.22,
        textTransform: 'uppercase',
        color: C.ink,
      }}
    >
      {children}
    </Text>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: 'Montserrat_600SemiBold',
        fontSize: 12,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: C.inkDim,
        marginBottom: 10,
        marginTop: 22,
      }}
    >
      {children}
    </Text>
  );
}

export function Card({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  const colors = useColors();
  const base: ViewStyle = {
    backgroundColor: colors.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  };
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [base, pressed && { opacity: 0.85 }, style]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[base, style]}>{children}</View>;
}

/** Silver-chrome primary button — chrome gradient, dark ink label, 10px radius. */
export function ChromeButton({
  title,
  onPress,
  disabled,
  loading,
  style,
  small,
}: {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        { borderRadius: 10, opacity: disabled ? 0.5 : pressed ? 0.85 : 1 },
        style,
      ]}
    >
      <LinearGradient
        colors={[C.chromeTop, C.chromeBottom]}
        style={{
          borderRadius: 10,
          borderWidth: 1,
          borderColor: C.chromeBorder,
          paddingVertical: small ? 9 : 13,
          paddingHorizontal: small ? 14 : 20,
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          gap: 8,
        }}
      >
        {loading ? <ActivityIndicator size="small" color={C.ink} /> : null}
        <Text
          style={{
            fontFamily: 'Inter_600SemiBold',
            fontSize: small ? 13 : 15,
            color: C.ink,
          }}
        >
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

/** Quiet secondary button — white fill, hairline border, ink label. */
export function GhostButton({
  title,
  onPress,
  style,
  small,
  destructive,
}: {
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  small?: boolean;
  destructive?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          borderRadius: 10,
          borderWidth: 1,
          borderColor: C.borderStrong,
          backgroundColor: C.white,
          paddingVertical: small ? 9 : 13,
          paddingHorizontal: small ? 14 : 20,
          alignItems: 'center',
          opacity: pressed ? 0.7 : 1,
        },
        style,
      ]}
    >
      <Text
        style={{
          fontFamily: 'Inter_600SemiBold',
          fontSize: small ? 13 : 15,
          color: destructive ? '#b91c1c' : C.ink,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

export function ProgressBar({ pct, height = 8 }: { pct: number; height?: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <View style={{ height, borderRadius: height / 2, backgroundColor: '#eef0f2', overflow: 'hidden' }}>
      <View
        style={{
          width: `${clamped}%`,
          height: '100%',
          borderRadius: height / 2,
          backgroundColor: C.cyan,
        }}
      />
    </View>
  );
}

export function StatTile({ label, value }: { label: string; value: string | number }) {
  return (
    <Card style={{ flex: 1, paddingVertical: 14, alignItems: 'center' }}>
      <Text style={{ fontFamily: 'Inter_700Bold', fontSize: 22, color: C.ink }}>{value}</Text>
      <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 11, color: C.inkDim, marginTop: 3, textAlign: 'center' }}>
        {label}
      </Text>
    </Card>
  );
}

export function LoadingView() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={C.ink} />
    </View>
  );
}

/** True when the API rejected the request because the account's plan doesn't include it. */
export function isPaywallError(error: unknown): boolean {
  const status = (error as { status?: number } | null)?.status;
  return status === 402 || status === 403;
}

export function ErrorView({ message, onRetry, error }: { message?: string; onRetry?: () => void; error?: unknown }) {
  const paywalled = isPaywallError(error);
  return (
    <View style={styles.center}>
      <Text style={{ fontFamily: 'Inter_500Medium', color: C.inkSoft, marginBottom: 12, textAlign: 'center' }}>
        {paywalled
          ? 'This content is part of a paid plan. Upgrade from your account on the PsychPro website to unlock it.'
          : (message ?? "Couldn't load this right now.")}
      </Text>
      {onRetry && !paywalled ? <GhostButton title="Try again" onPress={onRetry} small /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, backgroundColor: C.white },
});

export const INK = C;
