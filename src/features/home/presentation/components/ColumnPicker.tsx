/**
 * Reusable drum-roll column picker built on pure ScrollView.
 * No external library required.
 */
import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

export const ITEM_H = 48;
const VISIBLE = 5; // must be odd

interface ColumnPickerProps {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  textColor: string;
  selectedColor: string;
  surfaceColor: string;
  width?: number;
}

export const ColumnPicker: React.FC<ColumnPickerProps> = ({
  items,
  selectedIndex,
  onSelect,
  textColor,
  selectedColor,
  surfaceColor,
  width = 80,
}) => {
  const ref = useRef<ScrollView>(null);
  const pendingIndex = useRef(selectedIndex);

  const scrollTo = useCallback((index: number, animated = false) => {
    ref.current?.scrollTo({ y: index * ITEM_H, animated });
  }, []);

  // Initial scroll to selected item
  useEffect(() => {
    const timer = setTimeout(() => scrollTo(selectedIndex, false), 50);
    return () => clearTimeout(timer);
  }, []); // intentional: only run on mount

  // When selectedIndex changes externally (e.g. modal reopens)
  useEffect(() => {
    scrollTo(selectedIndex, true);
  }, [selectedIndex, scrollTo]);

  const handleScrollEnd = useCallback(
    (e: { nativeEvent: { contentOffset: { y: number } } }) => {
      const raw = e.nativeEvent.contentOffset.y / ITEM_H;
      const idx = Math.max(0, Math.min(Math.round(raw), items.length - 1));
      pendingIndex.current = idx;
      onSelect(idx);
    },
    [items.length, onSelect]
  );

  const center = Math.floor(VISIBLE / 2);

  return (
    <View style={[styles.container, { width, height: ITEM_H * VISIBLE }]}>
      {/* Highlight band */}
      <View
        pointerEvents="none"
        style={[
          styles.band,
          {
            top: center * ITEM_H,
            height: ITEM_H,
            backgroundColor: selectedColor + '22',
            borderTopColor: selectedColor + '55',
            borderBottomColor: selectedColor + '55',
          },
        ]}
      />
      <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_H}
        decelerationRate="fast"
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingVertical: center * ITEM_H }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
        style={{ backgroundColor: surfaceColor }}
      >
        {items.map((label, i) => {
          const selected = i === selectedIndex;
          return (
            <View key={label} style={[styles.item, { height: ITEM_H }]}>
              <Text
                style={[
                  styles.itemText,
                  { color: selected ? selectedColor : textColor },
                  selected && styles.selectedText,
                ]}
              >
                {label}
              </Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    zIndex: 1,
    pointerEvents: 'none',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 20,
  },
  selectedText: {
    fontWeight: '700',
    fontSize: 22,
  },
});
