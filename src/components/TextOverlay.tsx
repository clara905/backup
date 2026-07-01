import React, { useRef } from 'react';
import { Text, StyleSheet, PanResponder, Animated } from 'react-native';

/**
 * Text overlay position is stored as PERCENTAGES (0-100) of the media box,
 * not fixed 'top' | 'center' | 'bottom' strings. This lets the user drag it
 * anywhere (revision item 8) and lets us render it at the exact same spot
 * later in the feed (revision item 8 - overlay disappearing after publish).
 */
export interface TextOverlayData {
  text: string;
  color: string;
  xPct: number; // 0-100, left edge position
  yPct: number; // 0-100, top edge position
}

interface Props {
  data: TextOverlayData | null;
  editable?: boolean;
  onChangePosition?: (xPct: number, yPct: number) => void;
  containerWidth: number;
  containerHeight: number;
}

export default function TextOverlay({
  data,
  editable = false,
  onChangePosition,
  containerWidth,
  containerHeight,
}: Props) {
  const pan = useRef(new Animated.ValueXY()).current;
  const lastPct = useRef({ x: data?.xPct ?? 50, y: data?.yPct ?? 80 });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => editable,
      onMoveShouldSetPanResponder: () => editable,
      onPanResponderGrant: () => {
        pan.setOffset({ x: (pan.x as any)._value, y: (pan.y as any)._value });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: () => {
        pan.flattenOffset();
        const currentX = (pan.x as any)._value;
        const currentY = (pan.y as any)._value;
        const xPct = Math.min(90, Math.max(0, (currentX / containerWidth) * 100 + lastPct.current.x));
        const yPct = Math.min(90, Math.max(0, (currentY / containerHeight) * 100 + lastPct.current.y));
        lastPct.current = { x: xPct, y: yPct };
        pan.setValue({ x: 0, y: 0 });
        onChangePosition?.(xPct, yPct);
      },
    })
  ).current;

  if (!data || !data.text) return null;

  const left = (lastPct.current.x / 100) * containerWidth;
  const top = (lastPct.current.y / 100) * containerHeight;

  return (
    <Animated.View
      {...(editable ? panResponder.panHandlers : {})}
      style={[
        styles.wrapper,
        {
          left,
          top,
          transform: pan.getTranslateTransform(),
        },
        editable && styles.editableHint,
      ]}
    >
      <Text style={[styles.text, { color: data.color }]}>{data.text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    maxWidth: '90%',
  },
  editableHint: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    borderStyle: 'dashed',
    padding: 4,
  },
  text: {
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: '#000',
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 1 },
  },
});
