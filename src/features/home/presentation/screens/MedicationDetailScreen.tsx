import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@shared/components';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { HomeStackParamList } from '../navigation/HomeStackNavigator';
import { DatePickerBottomSheet } from '../components/DatePickerBottomSheet';
import { TimePickerBottomSheet } from '../components/TimePickerBottomSheet';
import { FrequencyPickerBottomSheet } from '../components/FrequencyPickerBottomSheet';
import { DosagePickerBottomSheet } from '../components/DosagePickerBottomSheet';
import { FormPickerBottomSheet } from '../components/FormPickerBottomSheet';
import { NoteBottomSheet } from '../components/NoteBottomSheet';
import { DeleteConfirmationModal } from '../components/DeleteConfirmationModal';

type MedicationDetailScreenProps = StackScreenProps<
  HomeStackParamList,
  'MedicationDetail'
>;

export const MedicationDetailScreen: React.FC<MedicationDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { medicine } = route.params;

  // State
  const [isEnabled, setIsEnabled] = React.useState(true);
  const [startDate, setStartDate] = React.useState<Date>(
    medicine.startDate ? new Date(medicine.startDate) : new Date()
  );
  const [time, setTime] = React.useState<string>(
    medicine.times?.[0] || '09:45'
  );
  const [frequencyValue, setFrequencyValue] = React.useState<number>(1);
  const [frequencyUnit, setFrequencyUnit] = React.useState<string>('Day');
  const [dosageAmount, setDosageAmount] = React.useState<string>('1');
  const [dosageForm, setDosageForm] = React.useState<string>('Tablet');
  const [initialStock] = React.useState<number>(30);
  const [note, setNote] = React.useState<string>(medicine.notes || '');

  // Modal visibility
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = React.useState(false);
  const [showDosagePicker, setShowDosagePicker] = React.useState(false);
  const [showFormPicker, setShowFormPicker] = React.useState(false);
  const [showNotePicker, setShowNotePicker] = React.useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  // Computed values
  const pillsTaken = 20;
  const daysSinceStart = React.useMemo(() => {
    const now = new Date();
    const diff = now.getTime() - startDate.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, [startDate]);

  const formatDate = (date: Date): string => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return `${date.getDate()} ${months[date.getMonth()]}`;
  };

  const formatTime = (timeStr: string): string => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const suffix = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    const m = String(minutes).padStart(2, '0');
    return `${h}:${m} ${suffix}`;
  };

  const getFrequencyDisplay = (): string => {
    if (frequencyUnit === 'Day') {
      return `${t('medicationDetail.every')} ${frequencyValue} ${t('medicationDetail.day')}`;
    }
    return `${t('medicationDetail.every')} ${frequencyValue} ${frequencyUnit}`;
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    navigation.goBack();
  };

  const handleDateSelect = (date: Date) => {
    setStartDate(date);
    setShowDatePicker(false);
  };

  const handleTimeSelect = (selectedTime: string) => {
    setTime(selectedTime);
    setShowTimePicker(false);
  };

  const handleFrequencySelect = (value: number, unit: string) => {
    setFrequencyValue(value);
    setFrequencyUnit(unit);
    setShowFrequencyPicker(false);
  };

  const handleDosageSelect = (amount: string) => {
    setDosageAmount(amount);
    setShowDosagePicker(false);
  };

  const handleFormSelect = (form: string) => {
    setDosageForm(form);
    setShowFormPicker(false);
  };

  const handleNoteSubmit = (newNote: string) => {
    setNote(newNote);
    setShowNotePicker(false);
  };

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: Math.max(insets.bottom, 16) + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Medicine Card */}
        <View style={styles.medicineCard}>
          <View
            style={[
              styles.medicineImageWrapper,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            {medicine.imageUrl ? (
              <Image
                source={{ uri: medicine.imageUrl }}
                style={styles.medicineImage}
                resizeMode="contain"
              />
            ) : (
              <Ionicons name="medical" size={40} color={theme.colors.primary} />
            )}
          </View>
          <Text style={[styles.medicineName, { color: theme.colors.text }]}>
            {medicine.name}
          </Text>
          <Switch
            value={isEnabled}
            onValueChange={setIsEnabled}
            trackColor={{
              false: '#D1D5DB',
              true: theme.colors.primary,
            }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Schedule Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('medicationDetail.schedule')}
        </Text>

        <View style={styles.rowFields}>
          {/* Start Date */}
          <TouchableOpacity
            style={[styles.fieldCard, { flex: 1 }]}
            onPress={() => setShowDatePicker(true)}
          >
            <View style={styles.fieldHeader}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                {t('medicationDetail.startDate')}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.fieldValue}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.fieldValueText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {formatDate(startDate)}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Time */}
          <TouchableOpacity
            style={[styles.fieldCard, { flex: 1 }]}
            onPress={() => setShowTimePicker(true)}
          >
            <View style={styles.fieldHeader}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                {t('medicationDetail.time')}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.fieldValue}>
              <Ionicons
                name="time-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.fieldValueText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {formatTime(time)}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Frequency */}
        <TouchableOpacity
          style={styles.fieldCard}
          onPress={() => setShowFrequencyPicker(true)}
        >
          <View style={styles.fieldHeader}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              {t('medicationDetail.frequency')}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textSecondary}
            />
          </View>
          <View style={styles.fieldValue}>
            <Ionicons
              name="time-outline"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.fieldValueText,
                { color: theme.colors.textSecondary },
              ]}
            >
              {getFrequencyDisplay()}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Dose Section */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {t('medicationDetail.dose')}
        </Text>

        <View style={styles.rowFields}>
          {/* Dose Amount */}
          <TouchableOpacity
            style={[styles.fieldCard, { flex: 1 }]}
            onPress={() => setShowDosagePicker(true)}
          >
            <View style={styles.fieldHeader}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                {t('medicationDetail.doseAmount')}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.fieldValue}>
              <Ionicons
                name="medkit-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.fieldValueText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {dosageAmount} {dosageForm}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Initial Stock */}
          <TouchableOpacity
            style={[styles.fieldCard, { flex: 1 }]}
            onPress={() => setShowFormPicker(true)}
          >
            <View style={styles.fieldHeader}>
              <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
                {t('medicationDetail.initialStock')}
              </Text>
              <Ionicons
                name="chevron-forward"
                size={18}
                color={theme.colors.textSecondary}
              />
            </View>
            <View style={styles.fieldValue}>
              <Ionicons
                name="ellipse-outline"
                size={16}
                color={theme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.fieldValueText,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {initialStock} {t('medicationDetail.pills')}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Note Section */}
        <TouchableOpacity
          style={styles.fieldCard}
          onPress={() => setShowNotePicker(true)}
        >
          <View style={styles.fieldHeader}>
            <Text style={[styles.fieldLabel, { color: theme.colors.text }]}>
              {t('medicationDetail.note')}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={theme.colors.textSecondary}
            />
          </View>
          <View style={styles.fieldValue}>
            <Ionicons
              name="document-text-outline"
              size={16}
              color={theme.colors.textSecondary}
            />
            <Text
              style={[
                styles.fieldValueText,
                { color: theme.colors.textSecondary },
              ]}
            >
              {note || t('medicationDetail.optionalNote')}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Stats Footer */}
        <View style={styles.statsRow}>
          <Ionicons name="water" size={24} color={theme.colors.primary} />
          <Text
            style={[styles.statsText, { color: theme.colors.textSecondary }]}
          >
            {pillsTaken} {t('medicationDetail.pillsTaken')}
          </Text>
          <Text
            style={[
              styles.statsSeparator,
              { color: theme.colors.textSecondary },
            ]}
          >
            |
          </Text>
          <Text
            style={[styles.statsText, { color: theme.colors.textSecondary }]}
          >
            {t('medicationDetail.started')} {daysSinceStart}{' '}
            {t('medicationDetail.daysAgo')}
          </Text>
        </View>

        {/* Delete Button */}
        <TouchableOpacity
          style={[
            styles.deleteButton,
            { borderColor: theme.colors.error || '#EF4444' },
          ]}
          onPress={() => setShowDeleteConfirm(true)}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color={theme.colors.error || '#EF4444'}
          />
          <Text
            style={[
              styles.deleteButtonText,
              { color: theme.colors.error || '#EF4444' },
            ]}
          >
            {t('medicationDetail.deleteMedication')}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Sheet Modals */}
      <DatePickerBottomSheet
        visible={showDatePicker}
        selectedDate={startDate}
        onSelect={handleDateSelect}
        onClose={() => setShowDatePicker(false)}
      />

      <TimePickerBottomSheet
        visible={showTimePicker}
        selectedTime={time}
        onSelect={handleTimeSelect}
        onClose={() => setShowTimePicker(false)}
      />

      <FrequencyPickerBottomSheet
        visible={showFrequencyPicker}
        selectedValue={frequencyValue}
        selectedUnit={frequencyUnit}
        onSelect={handleFrequencySelect}
        onClose={() => setShowFrequencyPicker(false)}
      />

      <DosagePickerBottomSheet
        visible={showDosagePicker}
        selectedDosage={dosageAmount}
        onSelect={handleDosageSelect}
        onClose={() => setShowDosagePicker(false)}
      />

      <FormPickerBottomSheet
        visible={showFormPicker}
        selectedForm={dosageForm}
        onSelect={handleFormSelect}
        onClose={() => setShowFormPicker(false)}
      />

      <NoteBottomSheet
        visible={showNotePicker}
        currentNote={note}
        onSubmit={handleNoteSubmit}
        onClose={() => setShowNotePicker(false)}
      />

      <DeleteConfirmationModal
        visible={showDeleteConfirm}
        medicineName={medicine.name}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  // Medicine Card
  medicineCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 28,
    paddingVertical: 8,
  },
  medicineImageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginRight: 14,
  },
  medicineImage: {
    width: '100%',
    height: '100%',
  },
  medicineName: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  // Section
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
  },
  // Field Cards
  rowFields: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  fieldCard: {
    marginBottom: 12,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  fieldValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fieldValueText: {
    fontSize: 14,
  },
  // Stats
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
    paddingVertical: 16,
  },
  statsText: {
    fontSize: 14,
  },
  statsSeparator: {
    fontSize: 14,
  },
  // Delete
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
