import { getAppHeaderChrome } from '@core/navigation/appHeaderChrome';
import { Ionicons } from '@expo/vector-icons';
import { ScreenWrapper } from '@shared/components';
import { useTheme } from '@shared/theme';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { Reminder } from '../../domain/entities/Reminder';
import { TimePicker } from '../components/TimePicker';
import { useReminders } from '../hooks/useReminders';

// ─── Constants ────────────────────────────────────────────────────────────────

const DAYS: { key: string; short: string }[] = [
  { key: 'SUN', short: 'DOM' },
  { key: 'MON', short: 'SEG' },
  { key: 'TUE', short: 'TER' },
  { key: 'WED', short: 'QUA' },
  { key: 'THU', short: 'QUI' },
  { key: 'FRI', short: 'SEX' },
  { key: 'SAT', short: 'SAB' },
];

const WEEKDAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const WEEKENDS = ['SAT', 'SUN'];
const ALL_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

type FrequencyPreset = 'daily' | 'weekdays' | 'weekends' | 'custom';

const WHEN_OPTIONS = [
  { value: 'anytime', label: 'Qualquer horario' },
  { value: 'before_food', label: 'Antes da refeicao' },
  { value: 'after_food', label: 'Depois da refeicao' },
  { value: 'with_food', label: 'Com alimento' },
  { value: 'empty_stomach', label: 'Jejum' },
];

const ADVANCE_MINUTES = [5, 10, 15, 30, 60];

const FREQUENCY_OPTIONS: ReadonlyArray<{
  value: FrequencyPreset;
  label: string;
}> = [
  { value: 'daily', label: 'Todo dia' },
  { value: 'weekdays', label: 'Semana' },
  { value: 'weekends', label: 'Fim semana' },
  { value: 'custom', label: 'Personalizado' },
];

// ─── Draft ────────────────────────────────────────────────────────────────────

interface ReminderDraft {
  times: string[];
  daysOfWeek: string[]; // empty = every day
  active: boolean;
  when: string; // stored locally only
  notifyInAdvance: boolean; // stored locally only
  advanceMinutes: number; // stored locally only
}

const emptyDraft = (): ReminderDraft => ({
  times: ['08:00'],
  daysOfWeek: [],
  active: true,
  when: 'anytime',
  notifyInAdvance: false,
  advanceMinutes: 30,
});

function draftFromReminder(r: Reminder): ReminderDraft {
  return {
    times: r.times.length > 0 ? [...r.times] : ['08:00'],
    daysOfWeek: [...(r.daysOfWeek ?? [])],
    active: r.active,
    when: 'anytime',
    notifyInAdvance: false,
    advanceMinutes: 30,
  };
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function SectionLabel({
  text,
  color,
}: Readonly<{ text: string; color: string }>) {
  return <Text style={[formStyles.questionLabel, { color }]}>{text}</Text>;
}

function getFrequencyPreset(daysOfWeek: string[]): FrequencyPreset {
  if (
    daysOfWeek.length === 0 ||
    ALL_DAYS.every((d) => daysOfWeek.includes(d))
  ) {
    return 'daily';
  }
  if (
    WEEKDAYS.every((d) => daysOfWeek.includes(d)) &&
    daysOfWeek.length === WEEKDAYS.length
  ) {
    return 'weekdays';
  }
  if (
    WEEKENDS.every((d) => daysOfWeek.includes(d)) &&
    daysOfWeek.length === WEEKENDS.length
  ) {
    return 'weekends';
  }
  return 'custom';
}

function getFrequencyLabel(daysOfWeek: string[]): string {
  const preset = getFrequencyPreset(daysOfWeek);
  if (preset === 'daily') return 'Todos os dias';
  if (preset === 'weekdays') return 'Dias uteis';
  if (preset === 'weekends') return 'Fim de semana';
  return daysOfWeek.join(', ');
}

function SelectRow({
  options,
  value,
  onChange,
  primary,
  surface,
  border,
  textSecondary,
}: Readonly<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
  primary: string;
  surface: string;
  border: string;
  textSecondary: string;
}>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={formStyles.selectScroll}
    >
      <View style={formStyles.selectRow}>
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              style={[
                formStyles.selectChip,
                {
                  borderColor: selected ? primary : border,
                  backgroundColor: selected ? primary + '18' : surface,
                },
              ]}
            >
              <Text
                style={[
                  formStyles.selectChipText,
                  { color: selected ? primary : textSecondary },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ─── Reminder form (full-screen modal) ───────────────────────────────────────

function ReminderForm({
  visible,
  draft,
  onChangeDraft,
  onSave,
  onCancel,
  saving,
  isEdit,
  medicineName,
  colors,
}: Readonly<{
  visible: boolean;
  draft: ReminderDraft;
  onChangeDraft: (d: ReminderDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  isEdit: boolean;
  medicineName: string;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
}>) {
  const set = <K extends keyof ReminderDraft>(key: K, val: ReminderDraft[K]) =>
    onChangeDraft({ ...draft, [key]: val });

  const [frequencyModalVisible, setFrequencyModalVisible] = useState(false);
  const [whenModalVisible, setWhenModalVisible] = useState(false);

  const frequencyPreset = useMemo(
    () => getFrequencyPreset(draft.daysOfWeek),
    [draft.daysOfWeek]
  );

  const toggleDay = (key: string) => {
    const next = draft.daysOfWeek.includes(key)
      ? draft.daysOfWeek.filter((d) => d !== key)
      : [...draft.daysOfWeek, key];
    set('daysOfWeek', next);
  };

  const selectFrequencyPreset = (preset: FrequencyPreset) => {
    if (preset === 'daily') {
      set('daysOfWeek', []);
      return;
    }
    if (preset === 'weekdays') {
      set('daysOfWeek', WEEKDAYS);
      return;
    }
    if (preset === 'weekends') {
      set('daysOfWeek', WEEKENDS);
      return;
    }
    set('daysOfWeek', WEEKDAYS);
  };

  const reminderSummary = `${draft.times.length > 0 ? draft.times.join(' • ') : 'Sem horario definido'} · ${getFrequencyLabel(
    draft.daysOfWeek
  )} · ${WHEN_OPTIONS.find((opt) => opt.value === draft.when)?.label ?? 'Qualquer horario'}`;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <View style={[formStyles.screen, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[formStyles.header, { borderBottomColor: colors.border }]}>
          <Text style={[formStyles.headerTitle, { color: colors.text }]}>
            {isEdit ? 'Editar lembrete' : 'Adicionar lembrete'}
          </Text>
          <TouchableOpacity
            onPress={onCancel}
            style={formStyles.closeBtn}
            hitSlop={12}
          >
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={formStyles.body}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Context */}
          <SectionLabel text="Qual remedio?" color={colors.text} />
          <View
            style={[
              formStyles.readOnlyField,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <Ionicons
              name="medical-outline"
              size={16}
              color={colors.textSecondary}
            />
            <Text
              style={[formStyles.readOnlyText, { color: colors.text }]}
              numberOfLines={1}
            >
              {medicineName}
            </Text>
          </View>

          {/* AT WHAT TIME */}
          <SectionLabel text="Qual horario?" color={colors.text} />
          <TimePicker
            times={draft.times}
            onChange={(t) => set('times', t)}
            primaryColor={colors.primary}
            surface={colors.surface}
            border={colors.border}
            textColor={colors.text}
            textSecondary={colors.textSecondary}
            background={colors.background}
          />

          {/* WHEN */}
          <SectionLabel text="Quando?" color={colors.text} />
          <TouchableOpacity
            style={[
              formStyles.frequencySelectBtn,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
            onPress={() => setWhenModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text
              style={[formStyles.frequencySelectText, { color: colors.text }]}
            >
              {WHEN_OPTIONS.find((opt) => opt.value === draft.when)?.label ??
                'Qualquer horario'}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <Modal
            visible={whenModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setWhenModalVisible(false)}
          >
            <Pressable
              style={formStyles.frequencyModalBackdrop}
              onPress={() => setWhenModalVisible(false)}
            />
            <View
              style={[
                formStyles.frequencyModalCard,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              {WHEN_OPTIONS.map((opt) => {
                const selected = draft.when === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    style={[
                      formStyles.frequencyOption,
                      { borderBottomColor: colors.border },
                    ]}
                    onPress={() => {
                      set('when', opt.value);
                      setWhenModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        formStyles.frequencyOptionText,
                        { color: selected ? colors.primary : colors.text },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {selected ? (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.primary}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </Modal>

          {/* HOW OFTEN */}
          <SectionLabel text="Com qual frequencia?" color={colors.text} />
          <TouchableOpacity
            style={[
              formStyles.frequencySelectBtn,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
            onPress={() => setFrequencyModalVisible(true)}
            activeOpacity={0.8}
          >
            <Text
              style={[formStyles.frequencySelectText, { color: colors.text }]}
            >
              {FREQUENCY_OPTIONS.find((opt) => opt.value === frequencyPreset)
                ?.label ?? 'Todo dia'}
            </Text>
            <Ionicons
              name="chevron-down"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <Modal
            visible={frequencyModalVisible}
            transparent
            animationType="fade"
            onRequestClose={() => setFrequencyModalVisible(false)}
          >
            <Pressable
              style={formStyles.frequencyModalBackdrop}
              onPress={() => setFrequencyModalVisible(false)}
            />
            <View
              style={[
                formStyles.frequencyModalCard,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                },
              ]}
            >
              {FREQUENCY_OPTIONS.map((opt) => {
                const selected = frequencyPreset === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    style={[
                      formStyles.frequencyOption,
                      { borderBottomColor: colors.border },
                    ]}
                    onPress={() => {
                      selectFrequencyPreset(opt.value);
                      setFrequencyModalVisible(false);
                    }}
                  >
                    <Text
                      style={[
                        formStyles.frequencyOptionText,
                        { color: selected ? colors.primary : colors.text },
                      ]}
                    >
                      {opt.label}
                    </Text>
                    {selected ? (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={colors.primary}
                      />
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          </Modal>

          {frequencyPreset === 'custom' && (
            <>
              <SectionLabel
                text="Escolha os dias"
                color={colors.textSecondary}
              />
              <View style={formStyles.daysRow}>
                {DAYS.map((d) => {
                  const selected = draft.daysOfWeek.includes(d.key);
                  return (
                    <Pressable
                      key={d.key}
                      onPress={() => toggleDay(d.key)}
                      style={[
                        formStyles.dayChip,
                        {
                          borderColor: selected
                            ? colors.primary
                            : colors.border,
                          backgroundColor: selected
                            ? colors.primary
                            : colors.surface,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          formStyles.dayChipText,
                          { color: selected ? '#fff' : colors.textSecondary },
                        ]}
                      >
                        {d.short}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {/* ENABLE + NOTIFY ROW */}
          <View style={formStyles.row2col}>
            {/* Enable reminder */}
            <View
              style={[
                formStyles.toggleCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text
                style={[formStyles.toggleCardLabel, { color: colors.text }]}
              >
                Ativar lembrete
              </Text>
              <Switch
                value={draft.active}
                onValueChange={(v) => set('active', v)}
                trackColor={{
                  false: colors.border,
                  true: colors.primary + '88',
                }}
                thumbColor={draft.active ? colors.primary : '#f4f3f4'}
              />
            </View>

            {/* Notify in advance */}
            <View
              style={[
                formStyles.toggleCard,
                { backgroundColor: colors.surface, borderColor: colors.border },
              ]}
            >
              <Text
                style={[formStyles.toggleCardLabel, { color: colors.text }]}
              >
                Notificar antes
              </Text>
              <Switch
                value={draft.notifyInAdvance}
                onValueChange={(v) => set('notifyInAdvance', v)}
                trackColor={{
                  false: colors.border,
                  true: colors.primary + '88',
                }}
                thumbColor={draft.notifyInAdvance ? colors.primary : '#f4f3f4'}
              />
            </View>
          </View>

          {/* Advance minutes selector — only when notify is ON */}
          {draft.notifyInAdvance && (
            <View>
              <SectionLabel text="Quantos minutos antes?" color={colors.text} />
              <SelectRow
                options={ADVANCE_MINUTES.map((m) => ({
                  value: String(m),
                  label: `${m} min`,
                }))}
                value={String(draft.advanceMinutes)}
                onChange={(v) => set('advanceMinutes', Number(v))}
                primary={colors.primary}
                surface={colors.surface}
                border={colors.border}
                textSecondary={colors.textSecondary}
              />
            </View>
          )}

          <View
            style={[
              formStyles.summaryCard,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
          >
            <Text style={[formStyles.summaryTitle, { color: colors.text }]}>
              Resumo do lembrete
            </Text>
            <Text
              style={[formStyles.summaryText, { color: colors.textSecondary }]}
            >
              {reminderSummary}
            </Text>
          </View>
        </ScrollView>

        {/* Save button */}
        <View
          style={[
            formStyles.footer,
            {
              borderTopColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              formStyles.saveBtn,
              { backgroundColor: colors.primary },
              saving && { opacity: 0.7 },
            ]}
            onPress={onSave}
            disabled={saving}
            activeOpacity={0.85}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={formStyles.saveBtnText}>
                {isEdit ? 'Salvar alteracoes' : 'Adicionar lembrete'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const formStyles = StyleSheet.create({
  screen: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerTitle: { fontSize: 19, fontWeight: '700', textAlign: 'center' },
  closeBtn: {
    position: 'absolute',
    right: 16,
    top: 12,
    padding: 4,
  },
  body: { padding: 20, gap: 6, paddingBottom: 40 },
  readOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '100%',
    minHeight: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  readOnlyText: { fontSize: 15, fontWeight: '600', flex: 1 },
  questionLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  selectScroll: { marginBottom: 4 },
  selectRow: { flexDirection: 'row', gap: 8, paddingBottom: 2 },
  selectChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
  },
  selectChipText: { fontSize: 14, fontWeight: '500' },
  frequencySelectBtn: {
    minHeight: 46,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  frequencySelectText: {
    fontSize: 15,
    fontWeight: '600',
  },
  frequencyModalBackdrop: {
    flex: 1,
    backgroundColor: '#00000040',
  },
  frequencyModalCard: {
    position: 'absolute',
    top: 240,
    left: 20,
    right: 20,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  frequencyOption: {
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  frequencyOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  daysRow: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },
  dayChip: {
    minWidth: 44,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 8,
  },
  dayChipText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 14,
  },
  row2col: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  toggleCard: {
    flex: 1,
    padding: 14,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  toggleCardLabel: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 17,
  },
  summaryCard: {
    marginTop: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 12,
    padding: 12,
    gap: 4,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '700',
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  saveBtn: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

// ─── Reminder card (list view) ────────────────────────────────────────────────

function ReminderCard({
  reminder,
  onEdit,
  onDelete,
  onToggle,
  colors,
}: Readonly<{
  reminder: Reminder;
  onEdit: () => void;
  onDelete: () => void;
  onToggle: (v: boolean) => void;
  colors: ReturnType<typeof useTheme>['theme']['colors'];
}>) {
  const daysLabel =
    reminder.daysOfWeek.length === 0
      ? 'Todos os dias'
      : reminder.daysOfWeek.join(' · ');

  return (
    <View
      style={[
        cardStyles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={cardStyles.top}>
        <View style={cardStyles.info}>
          <Text style={[cardStyles.times, { color: colors.text }]}>
            {reminder.times.length > 0
              ? reminder.times.join('  ·  ')
              : 'Sem horarios definidos'}
          </Text>
          <Text style={[cardStyles.days, { color: colors.textSecondary }]}>
            {daysLabel}
          </Text>
        </View>
        <Switch
          value={reminder.active}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: colors.primary + '88' }}
          thumbColor={reminder.active ? colors.primary : '#f4f3f4'}
        />
      </View>
      <View style={[cardStyles.actions, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={cardStyles.actionBtn} onPress={onEdit}>
          <Ionicons name="pencil-outline" size={15} color={colors.primary} />
          <Text style={[cardStyles.actionText, { color: colors.primary }]}>
            Editar
          </Text>
        </TouchableOpacity>
        <View
          style={[cardStyles.divider, { backgroundColor: colors.border }]}
        />
        <TouchableOpacity style={cardStyles.actionBtn} onPress={onDelete}>
          <Ionicons name="trash-outline" size={15} color="#FF453A" />
          <Text style={[cardStyles.actionText, { color: '#FF453A' }]}>
            Remover
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    marginBottom: 12,
    overflow: 'hidden',
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  info: { flex: 1 },
  times: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  days: { fontSize: 13 },
  actions: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 11,
  },
  actionText: { fontSize: 14, fontWeight: '600' },
  divider: { width: StyleSheet.hairlineWidth, marginVertical: 8 },
});

// ─── Main screen ──────────────────────────────────────────────────────────────

export const RemindersScreen: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { medicineId: rawId, medicineName: rawName } = useLocalSearchParams<{
    medicineId?: string | string[];
    medicineName?: string | string[];
  }>();

  const medicineId = Array.isArray(rawId) ? rawId[0] : (rawId ?? '');
  const medicineName = Array.isArray(rawName)
    ? rawName[0]
    : (rawName ?? 'Medicamento');

  const {
    reminders,
    loading,
    error,
    createReminder,
    updateReminder,
    deleteReminder,
  } = useReminders(medicineId);

  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ReminderDraft>(emptyDraft());
  const [saving, setSaving] = useState(false);

  const { colors } = theme;

  const listContent = () => {
    if (loading) {
      return (
        <View style={listStyles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={listStyles.centered}>
          <Text style={{ color: '#FF453A', fontSize: 15, textAlign: 'center' }}>
            {error}
          </Text>
        </View>
      );
    }

    if (reminders.length === 0) {
      return (
        <View style={listStyles.empty}>
          <View
            style={[
              listStyles.emptyIcon,
              { backgroundColor: colors.primary + '14' },
            ]}
          >
            <Ionicons name="alarm-outline" size={32} color={colors.primary} />
          </View>
          <Text style={[listStyles.emptyTitle, { color: colors.text }]}>
            Nenhum lembrete ainda
          </Text>
          <Text style={[listStyles.emptySub, { color: colors.textSecondary }]}>
            Adicione um lembrete para ser avisado na hora de tomar{' '}
            {medicineName}.
          </Text>
        </View>
      );
    }

    return reminders.map((r) => (
      <ReminderCard
        key={r.id}
        reminder={r}
        onEdit={() => openEdit(r)}
        onDelete={() => handleDelete(r)}
        onToggle={(v) =>
          updateReminder(r.id, { active: v }).catch((err) =>
            Alert.alert('Erro', err instanceof Error ? err.message : 'Erro')
          )
        }
        colors={colors}
      />
    ));
  };

  const openCreate = () => {
    setEditingId(null);
    setDraft(emptyDraft());
    setFormVisible(true);
  };

  const openEdit = (r: Reminder) => {
    setEditingId(r.id);
    setDraft(draftFromReminder(r));
    setFormVisible(true);
  };

  const handleSave = async () => {
    if (draft.times.length === 0) {
      Alert.alert(
        'Obrigatorio',
        'Adicione pelo menos um horario para o lembrete.'
      );
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await updateReminder(editingId, {
          times: draft.times,
          daysOfWeek: draft.daysOfWeek,
          active: draft.active,
        });
      } else {
        await createReminder({
          medicineId,
          times: draft.times,
          daysOfWeek: draft.daysOfWeek,
          active: draft.active,
        });
      }
      setFormVisible(false);
    } catch (err) {
      Alert.alert(
        'Erro',
        err instanceof Error
          ? err.message
          : 'Nao foi possivel salvar o lembrete'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (r: Reminder) => {
    Alert.alert(
      'Remover lembrete',
      `Deseja remover o lembrete ${r.times.join(', ')}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () =>
            deleteReminder(r.id).catch((err) =>
              Alert.alert('Erro', err instanceof Error ? err.message : 'Erro')
            ),
        },
      ]
    );
  };

  return (
    <ScreenWrapper tabContentCanvas homeSoftTint>
      <Stack.Screen
        options={{
          title: `Lembretes · ${medicineName}`,
          ...getAppHeaderChrome({
            theme,
            isDark,
            contentBackgroundColor: colors.background,
          }),
        }}
      />

      <ScrollView
        contentContainerStyle={listStyles.content}
        showsVerticalScrollIndicator={false}
      >
        {listContent()}
      </ScrollView>

      {/* Add button */}
      <View
        style={[
          listStyles.fab,
          { borderTopColor: colors.border, backgroundColor: colors.background },
        ]}
      >
        <TouchableOpacity
          style={[listStyles.fabBtn, { backgroundColor: colors.primary }]}
          onPress={openCreate}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={listStyles.fabBtnText}>Adicionar lembrete</Text>
        </TouchableOpacity>
      </View>

      <ReminderForm
        visible={formVisible}
        draft={draft}
        onChangeDraft={setDraft}
        onSave={() => void handleSave()}
        onCancel={() => setFormVisible(false)}
        saving={saving}
        isEdit={editingId !== null}
        medicineName={medicineName}
        colors={colors}
      />
    </ScreenWrapper>
  );
};

const listStyles = StyleSheet.create({
  content: { padding: 16, paddingBottom: 110 },
  centered: { paddingTop: 80, alignItems: 'center' },
  empty: {
    alignItems: 'center',
    paddingTop: 64,
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptySub: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  fab: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  fabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  fabBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
