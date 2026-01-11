import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button } from './Button';

/**
 * Modern Button Component Examples
 *
 * Features:
 * - Multiple variants: primary, secondary, outline, ghost, danger
 * - Three sizes: small, medium, large
 * - Loading state with spinner
 * - Icon support
 * - Full width option
 * - Smooth animations with scale effect
 * - Modern shadows and elevation
 * - Letter spacing for better typography
 */

export const ButtonExamples: React.FC = () => {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const simulateLoading = (id: string) => {
    setLoadingId(id);
    setTimeout(() => setLoadingId(null), 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Primary Buttons */}
      <View style={styles.section}>
        <View style={styles.sectionTitle}>
          <View style={styles.dot} />
        </View>

        <Button
          title="Primary Small"
          size="small"
          onPress={() => console.log('Pressed')}
        />
        <Button
          title="Primary Medium"
          size="medium"
          onPress={() => console.log('Pressed')}
        />
        <Button
          title="Primary Large"
          size="large"
          onPress={() => console.log('Pressed')}
        />
      </View>

      {/* Secondary Buttons */}
      <View style={styles.section}>
        <Button
          title="Secondary Button"
          variant="secondary"
          onPress={() => console.log('Pressed')}
        />
      </View>

      {/* Outline Buttons */}
      <View style={styles.section}>
        <Button
          title="Outline Button"
          variant="outline"
          onPress={() => console.log('Pressed')}
        />
      </View>

      {/* Ghost Buttons */}
      <View style={styles.section}>
        <Button
          title="Ghost Button"
          variant="ghost"
          onPress={() => console.log('Pressed')}
        />
      </View>

      {/* Danger Buttons */}
      <View style={styles.section}>
        <Button
          title="Delete"
          variant="danger"
          onPress={() => console.log('Delete pressed')}
        />
      </View>

      {/* Full Width Button */}
      <View style={styles.section}>
        <Button
          title="Full Width Button"
          fullWidth
          onPress={() => console.log('Pressed')}
        />
      </View>

      {/* Loading State */}
      <View style={styles.section}>
        <Button
          title={loadingId === 'loading1' ? 'Loading...' : 'Click to Load'}
          loading={loadingId === 'loading1'}
          onPress={() => simulateLoading('loading1')}
        />
      </View>

      {/* Disabled State */}
      <View style={styles.section}>
        <Button
          title="Disabled Button"
          disabled
          onPress={() => console.log('This should not work')}
        />
      </View>

      {/* Combined Features */}
      <View style={styles.section}>
        <Button
          title="Save Changes"
          variant="primary"
          size="large"
          fullWidth
          onPress={() => console.log('Save pressed')}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    gap: 12,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#007AFF',
    marginRight: 8,
  },
});
