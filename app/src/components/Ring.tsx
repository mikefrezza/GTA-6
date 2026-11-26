import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Stop } from "react-native-svg";
import { formatXp } from "../game";
import { colors, fonts } from "../theme";

type Props = {
  ratio: number;
  size?: number;
  stroke?: number;
  label: string;
  children?: ReactNode;
};

export function Ring({ ratio, size = 136, stroke = 10, label, children }: Props) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(1, Math.max(0, ratio));
  const offset = circumference * (1 - clamped);
  const gradientId = `ring-${size}`;

  return (
    <View style={{ width: size, height: size }} accessibilityRole="image" accessibilityLabel={label}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#ff4d93" />
            <Stop offset="52%" stopColor="#ffc857" />
            <Stop offset="100%" stopColor="#5ef2e0" />
          </LinearGradient>
        </Defs>
        <Circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={offset}
          rotation={-90}
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.center}>{children}</View>
    </View>
  );
}

export function XpBar({ into, need, ratio }: { into: number; need: number; ratio: number }) {
  const width = `${Math.min(100, Math.max(0, ratio * 100))}%` as const;
  return (
    <View style={styles.xpbar}>
      <View
        style={styles.track}
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: need, now: into }}
        accessibilityLabel="XP to next level"
      >
        <View style={[styles.fill, { width }]} />
      </View>
      <View style={styles.meta}>
        <Text style={styles.metaText}>
          {formatXp(into)} / {formatXp(need)} XP
        </Text>
        <Text style={styles.metaText}>to next level</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  xpbar: { width: "100%", marginTop: 12 },
  track: {
    height: 8,
    borderRadius: 99,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 99, backgroundColor: colors.magenta },
  meta: { marginTop: 6, flexDirection: "row", justifyContent: "space-between" },
  metaText: { color: colors.dim, fontFamily: fonts.body, fontSize: 12 },
});
