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
import { Card, ScreenWrapper, Loader, SkeletonCard } from '@shared/components';
import { useOnboardingStorage } from '@features/onboarding';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { MedicineReminderCalendar } from '../components';
import { useHomeData } from '../hooks/useHomeData';
import { GetMedicinesUseCase } from '../../domain/useCases/GetMedicinesUseCase';
import { MockMedicineRepository } from '../hooks/__mocks__/mockMedicineRepository';

// TODO: Replace with real repository when API is ready
const medicineRepository = new MockMedicineRepository();
const getMedicinesUseCase = new GetMedicinesUseCase(medicineRepository);

const MEDICINES_PREVIEW_LIMIT = 5;

export const HomeScreen: React.FC = () => {
  useOnboardingStorage();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { medicines, loading, refreshing, error, refresh } =
    useHomeData(getMedicinesUseCase);
  const [showAllMedicines, setShowAllMedicines] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState(() => new Date());
  const [viewMode, setViewMode] = React.useState<'today' | 'week' | 'month'>(
    'today'
  );

  const visibleMedicines = showAllMedicines
    ? medicines
    : medicines.slice(0, MEDICINES_PREVIEW_LIMIT);
  const viewAllLabel = showAllMedicines
    ? t('home.viewLess')
    : t('home.viewAll');

  const renderMedicinesContent = () => {
    if (loading && medicines.length === 0) {
      return (
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
      );
    }

    if (medicines.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Ionicons
            name="medkit-outline"
            size={64}
            color={theme.colors.textSecondary}
          />
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            {t('home.noMedicationsScheduled')}
          </Text>
          <Text
            style={[
              styles.emptySubtitle,
              { color: theme.colors.textSecondary },
            ]}
          >
            {t('home.addFirstMedication')}
          </Text>
          <TouchableOpacity style={styles.addMedicationButton}>
            <Text style={styles.addMedicationText}>
              + {t('home.addMedication')}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <>
        {visibleMedicines.map((medicine) => (
          <Card key={medicine.id} style={styles.medicineCard}>
            <View style={styles.medicineCardContent}>
              <Ionicons name="medical" size={32} color={theme.colors.primary} />
              <View style={styles.medicineInfo}>
                <Text
                  style={[styles.medicineName, { color: theme.colors.text }]}
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
        ))}

        {medicines.length > MEDICINES_PREVIEW_LIMIT && (
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => setShowAllMedicines((prev) => !prev)}
          >
            <Text style={[styles.viewAllText, { color: theme.colors.primary }]}>
              {viewAllLabel}
            </Text>
          </TouchableOpacity>
        )}
      </>
    );
  };

  // Show error alert if there's an error
  React.useEffect(() => {
    if (error) {
      Alert.alert(t('common.error'), error, [
        {
          text: t('common.retry'),
          onPress: () => {
            void refresh();
          },
        },
        {
          text: t('common.ok'),
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
          message={t('home.loadingMedications')}
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
            onRefresh={() => {
              void refresh();
            }}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
        testID="home-scroll-view"
      >
        {/* Calendar Component */}
        <MedicineReminderCalendar
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Medicines Section */}
        <View style={styles.medicinesSection}>
          {/* Loading skeleton while refreshing */}
          {refreshing && medicines.length > 0 && (
            <View style={styles.refreshLoader}>
              <Loader
                variant="inline"
                size="small"
                message={t('home.refreshingMedications')}
                testID="home-refresh-loader"
              />
            </View>
          )}

          {renderMedicinesContent()}
        </View>

        {/* Controles de Debug - só aparecem em desenvolvimento */}
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
    paddingTop: 8,
  },
  medicinesSection: {
    marginTop: 32,
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
  viewAllButton: {
    alignSelf: 'center',
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptySubtitle: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
  },
  addMedicationButton: {
    marginTop: 18,
    backgroundColor: '#0A63FF',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addMedicationText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
