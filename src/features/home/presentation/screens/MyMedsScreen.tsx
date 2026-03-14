import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { Card, ScreenWrapper, Loader, SkeletonCard } from '@shared/components';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { useHomeData } from '../hooks/useHomeData';
import { getMedicinesUseCase } from '../medicine.dependencies';

export const MyMedsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { medicines, loading, refreshing, error, refresh } =
    useHomeData(getMedicinesUseCase);

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
  }, [error, refresh, t]);

  if (loading && medicines.length === 0) {
    return (
      <ScreenWrapper>
        <Loader
          variant="fullscreen"
          message={t('home.loadingMedications')}
          testID="my-meds-initial-loader"
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              void refresh();
            }}
            tintColor={theme.colors.primary}
          />
        }
      >
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t('home.yourMedications')}
        </Text>

        {medicines.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="medkit-outline"
              size={64}
              color={theme.colors.textSecondary}
            />
            <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
              {t('home.noMedicationsFound')}
            </Text>
            <Text
              style={[
                styles.emptySubtitle,
                { color: theme.colors.textSecondary },
              ]}
            >
              {t('home.addFirstMedication')}
            </Text>
          </View>
        ) : (
          medicines.map((medicine) => (
            <Card key={medicine.id} style={styles.medicineCard}>
              <View style={styles.medicineCardContent}>
                {medicine.imageUrl ? (
                  <Image
                    source={{ uri: medicine.imageUrl }}
                    style={styles.medicineImage}
                  />
                ) : (
                  <Ionicons
                    name="medical"
                    size={32}
                    color={theme.colors.primary}
                  />
                )}
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
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  medicineCard: {
    marginBottom: 12,
  },
  medicineCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  medicineImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
  },
  medicineDosage: {
    fontSize: 13,
    marginTop: 2,
  },
  medicineNotes: {
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
});
