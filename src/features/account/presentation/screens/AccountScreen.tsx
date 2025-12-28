import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, ScreenWrapper } from '@shared/components';

export const AccountScreen: React.FC = () => {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Card>
          <Text>Account Screen Content</Text>
        </Card>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
});
