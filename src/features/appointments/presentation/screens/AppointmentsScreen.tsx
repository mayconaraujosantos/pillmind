import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@shared/components';

export const AppointmentsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointments</Text>
      <Card>
        <Text>Appointments Screen Content</Text>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
