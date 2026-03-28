import type { HomeTabParamList } from '@core/navigation/types';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenWrapper } from '@shared/components';
import { useTheme } from '@shared/theme';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Alert,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { Medicine } from '../../domain/entities/Medicine';
import { MedicationScheduleRow } from '../components/MedicationScheduleRow';
import { useMedicines } from '../hooks/useMedicines';
import { useMedicineTaken } from '../hooks/useMedicineTaken';

export const ScheduleScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<HomeTabParamList>>();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { medicines, loading, error, refreshing, refresh } = useMedicines();
  const { 
    getTakeStatus, 
    getPostponedUntil,
    markAsTaken, 
    postponeDose,
    skipDose, 
    loading: takenLoading,
    error: takenError 
  } = useMedicineTaken();

  const handleMarkAsTaken = async (medicineId: string, time: string) => {
    try {
      await markAsTaken(medicineId, time);
    } catch (err) {
      Alert.alert('Erro', 
        err instanceof Error ? err.message : 'Não foi possível marcar como tomado'
      );
    }
  };

  const handleSkipDose = async (medicineId: string, time: string) => {
    try {
      await skipDose(medicineId, time);
    } catch (err) {
      Alert.alert('Erro',
        err instanceof Error ? err.message : 'Não foi possível pular dose'
      );
    }
  };

  const handlePostponeDose = async (medicine: Medicine, time: string) => {
    try {
      await postponeDose(medicine, time, 10);
      const postponedUntil = getPostponedUntil(medicine.id, time);
      Alert.alert(
        'Dose adiada',
        postponedUntil
          ? `Novo lembrete previsto para ${postponedUntil.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}`
          : 'Novo lembrete previsto em 10 minutos'
      );
    } catch (err) {
      Alert.alert(
        'Erro',
        err instanceof Error ? err.message : 'Não foi possível adiar a dose'
      );
    }
  };

  const handleEdit = (medicine: Medicine) => {
    navigation.navigate('MedicineForm', { medicineId: medicine.id });
  };

  const handleDelete = async (medicine: Medicine) => {
    Alert.alert(
      'Confirmar exclusão',
      `Tem certeza que deseja excluir ${medicine.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            // Handle delete logic here
            console.log('Delete medicine:', medicine.id);
          }
        }
      ]
    );
  };

  // Expandir medicamentos em doses individuais para cada horário
  const expandedMedicineList = useMemo(() => {
    const expanded: Array<{
      medicine: Medicine;
      scheduledTime: string;
    }> = [];

    medicines.forEach((medicine) => {
      if (medicine.times.length === 0) {
        // Se não tem horários, adiciona um entry vazio
        expanded.push({
          medicine,
          scheduledTime: '—',
        });
      } else {
        // Cria um entry para cada horário
        medicine.times.forEach((time) => {
          expanded.push({
            medicine,
            scheduledTime: time,
          });
        });
      }
    });

    // Ordenar por horário
    return expanded.sort((a, b) => {
      const timeA = parseTimeToMinutes(a.scheduledTime); 
      const timeB = parseTimeToMinutes(b.scheduledTime);
      return timeA - timeB;
    });
  }, [medicines]);

  // Converter horário HH:MM para minutos desde meia-noite
  const parseTimeToMinutes = (time: string): number => {
    if (time === '—') return 0;
    try {
      const [hours, minutes] = time.split(':').map(Number);
      if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
      return hours * 60 + minutes;
    } catch {
      return 0;
    }
  };

  // Mostrar erro se houver
  const handleErrorPress = () => {
    const errorMessage = error || takenError || 'Erro desconhecido';
    Alert.alert(
      'Erro ao carregar dados',
      errorMessage,
      [
        { text: 'Tentar novamente', onPress: () => refresh() },
        { text: 'OK', style: 'cancel' }
      ]
    );
  };

  return (
    <ScreenWrapper>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
            Schedule
          </Text>
          <View style={styles.headerRight}>
            {(error || takenError) && (
              <Pressable style={styles.errorButton} onPress={handleErrorPress}>
                <MaterialIcons name="error" size={24} color={theme.colors.error} />
              </Pressable>
            )}
            <Pressable style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.text} />
            </Pressable>
          </View>
        </View>

        {(loading || takenLoading) && !refreshing && (
          <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
              Carregando medicamentos...
            </Text>
          </View>
        )}

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
        >
          {expandedMedicineList.length === 0 && !loading ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="healing" size={64} color={theme.colors.textSecondary} />
              <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
                Nenhum medicamento encontrado
              </Text>
              <Text style={[styles.emptyMessage, { color: theme.colors.textSecondary }]}>
                Adicione medicamentos para ver seu cronograma
              </Text>
              <Pressable 
                style={[styles.addFirstButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('MedicineForm', {})}
              >
                <Text style={styles.addFirstButtonText}>
                  Adicionar Medicamento
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.medicineList}>
              {expandedMedicineList.map((item, index) => (
                <MedicationScheduleRow
                  key={`${item.medicine.id}-${item.scheduledTime}`}
                  medicine={item.medicine}
                  theme={theme}
                  t={t}
                  scheduledTime={item.scheduledTime}
                  takeStatus={getTakeStatus(item.medicine.id, item.scheduledTime)}
                  onMarkAsTaken={() => handleMarkAsTaken(item.medicine.id, item.scheduledTime)}
                  onPostponeDose={() => handlePostponeDose(item.medicine, item.scheduledTime)}
                  onSkipDose={() => handleSkipDose(item.medicine.id, item.scheduledTime)}
                  onEdit={() => handleEdit(item.medicine)}
                  onDelete={() => handleDelete(item.medicine)}
                  isLast={index === expandedMedicineList.length - 1}
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Footer navigation */}
        <View style={[styles.footer, { borderTopColor: theme.colors.border }]}>
          <Pressable style={styles.footerButton}>
            <Ionicons name="calendar-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              Reminders
            </Text>
          </Pressable>
          
          <Pressable style={styles.footerButton}>
            <MaterialIcons name="healing" size={24} color={theme.colors.textSecondary} />
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              Medicines
            </Text>
          </Pressable>
          
          <Pressable 
            style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate('MedicineForm', {})}
          >
            <Ionicons name="add" size={24} color="white" />
          </Pressable>
          
          <Pressable style={styles.footerButton}>
            <Ionicons name="calendar" size={24} color={theme.colors.primary} />
            <Text style={[styles.footerText, { color: theme.colors.primary }]}>
              Schedule
            </Text>
          </Pressable>
          
          <Pressable style={styles.footerButton}>
            <Ionicons name="time-outline" size={24} color={theme.colors.textSecondary} />
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
              History
            </Text>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  notificationButton: {
    padding: 4,
  },
  errorButton: {
    padding: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  addFirstButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  addFirstButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  medicineList: {
    paddingVertical: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    backgroundColor: 'transparent',
  },
  footerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});