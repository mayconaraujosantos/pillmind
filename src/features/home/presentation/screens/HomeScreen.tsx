import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, ScreenWrapper, Loader, SkeletonCard } from '@shared/components';
import { useOnboardingStorage } from '@features/onboarding';
import { useAuthContext } from '@features/onboarding/presentation/contexts/AuthContext';
import { SHOW_DEBUG_CONTROLS } from '@features/onboarding/presentation/constants/onboarding.constants';
import { useTheme } from '@shared/theme';
import { Ionicons } from '@expo/vector-icons';
import { useHomeData } from '../hooks/useHomeData';
import { GetMedicinesUseCase } from '../../domain/useCases/GetMedicinesUseCase';
import { MockMedicineRepository } from '../hooks/__mocks__/mockMedicineRepository';

// TODO: Replace with real repository when API is ready
const medicineRepository = new MockMedicineRepository();
const getMedicinesUseCase = new GetMedicinesUseCase(medicineRepository);

export const HomeScreen: React.FC = () => {
  const { resetOnboarding } = useOnboardingStorage();
  const authContext = useAuthContext();
  const { theme } = useTheme();
  const { medicines, loading, refreshing, error, refresh } =
    useHomeData(getMedicinesUseCase);

  // Show error alert if there's an error
  React.useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        {
          text: 'Retry',
          onPress: refresh,
        },
        {
          text: 'OK',
          style: 'cancel',
        },
      ]);
    }
  }, [error, refresh]);

  // Show full-screen loader on initial load
  if (loading && medicines.length === 0) {
    return (
      <ScreenWrapper>
        <Loader
          variant="fullscreen"
          message="Loading your medications..."
          testID="home-initial-loader"
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        testID="home-scroll-view"
      >
        {/* Welcome Card */}
        <Card>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            PillMind Home
          </Text>
          <Text
            style={[styles.subtitle, { color: theme.colors.textSecondary }]}
          >
            Welcome to your medication assistant!
          </Text>
        </Card>

        {/* User Info Card */}
        {authContext.isAuthenticated && (
          <Card style={styles.userCard}>
            <View style={styles.userCardContent}>
              <Ionicons
                name="person-circle"
                size={40}
                color={theme.colors.primary}
              />
              <View style={styles.userInfo}>
                <Text style={[styles.userName, { color: theme.colors.text }]}>
                  {authContext.user?.name || 'User'}
                </Text>
                <Text
                  style={[
                    styles.userEmail,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {authContext.user?.email}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Medicines Section */}
        <View style={styles.medicinesSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Your Medications
          </Text>

          {/* Loading skeleton while refreshing */}
          {refreshing && medicines.length > 0 && (
            <View style={styles.refreshLoader}>
              <Loader
                variant="inline"
                size="small"
                message="Refreshing..."
                testID="home-refresh-loader"
              />
            </View>
          )}

          {/* Show skeleton cards during initial load */}
          {loading && medicines.length === 0 ? (
            <View>
              {[1, 2, 3].map((i) => (
                <SkeletonCard
                  key={i}
                  lines={2}
                  showAvatar={false}
                  style={styles.medicineCard}
                />
              ))}
            </View>
          ) : medicines.length === 0 ? (
            // Empty state
            <Card style={styles.emptyCard}>
              <Ionicons
                name="medical-outline"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.emptyText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                No medications found
              </Text>
              <Text
                style={[
                  styles.emptySubtext,
                  { color: theme.colors.textSecondary },
                ]}
              >
                Add your first medication to get started
              </Text>
            </Card>
          ) : (
            // Medicines list
            medicines.map((medicine) => (
              <Card key={medicine.id} style={styles.medicineCard}>
                <View style={styles.medicineCardContent}>
                  <Ionicons
                    name="medical"
                    size={32}
                    color={theme.colors.primary}
                  />
                  <View style={styles.medicineInfo}>
                    <Text
                      style={[
                        styles.medicineName,
                        { color: theme.colors.text },
                      ]}
                    >
                      {medicine.name}
                    </Text>
                    <Text
                      style={[
                        styles.medicineDosage,
                        { color: theme.colors.textSecondary },
                      ]}
                    >
                      {medicine.dosage} • {medicine.frequency}
                    </Text>
                    {medicine.notes && (
                      <Text
                        style={[
                          styles.medicineNotes,
                          { color: theme.colors.textSecondary },
                        ]}
                      >
                        {medicine.notes}
                      </Text>
                    )}
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Controles de Debug - só aparecem em desenvolvimento */}
        {SHOW_DEBUG_CONTROLS && (
          <Card style={styles.debugCard}>
            <Text style={styles.debugTitle}>🛠️ Debug Controls</Text>
            <TouchableOpacity
              style={styles.debugButton}
              onPress={resetOnboarding}
            >
              <Text style={styles.debugButtonText}>↻ Reset Onboarding</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.debugButton, styles.clearStorageButton]}
              onPress={async () => {
                try {
                  await AsyncStorage.clear();
                  Alert.alert(
                    'Success',
                    'All storage cleared! Please close and reopen the app.',
                    [{ text: 'OK' }]
                  );
                } catch {
                  Alert.alert('Error', 'Failed to clear storage');
                }
              }}
            >
              <Text style={styles.debugButtonText}>🗑️ Clear All Storage</Text>
            </TouchableOpacity>
            <Text style={styles.debugInfo}>
              Reset onboarding or clear all storage (including auth)
            </Text>
          </Card>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  userCard: {
    marginTop: 20,
    padding: 16,
  },
  userCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginLeft: 12,
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
  },
  medicinesSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  refreshLoader: {
    marginBottom: 12,
  },
  medicineCard: {
    marginBottom: 12,
    padding: 16,
  },
  medicineCardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  medicineInfo: {
    marginLeft: 12,
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  medicineDosage: {
    fontSize: 14,
    marginBottom: 4,
  },
  medicineNotes: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  emptyCard: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  debugCard: {
    marginTop: 20,
    backgroundColor: '#FFF3CD',
    borderColor: '#FFEAA7',
    borderWidth: 1,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 12,
    textAlign: 'center',
  },
  debugButton: {
    backgroundColor: '#FD79A8',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 8,
  },
  clearStorageButton: {
    backgroundColor: '#FF6B6B',
    marginTop: 4,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  debugInfo: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
