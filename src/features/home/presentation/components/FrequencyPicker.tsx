/**
 * FrequencyPicker — compact selector with modal options.
 * Auto-suggests reminder times when a preset is selected.
 */
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// ─── Presets ─────────────────────────────────────────────────────────────────

export interface FrequencyPreset {
  label: string;
  sublabel: string;
  value: string;
  /** Times to suggest when this preset is selected. Empty = no auto-suggestion. */
  suggestedTimes: string[];
}

export const FREQUENCY_PRESETS: FrequencyPreset[] = [
  {
    label: '1× ao dia',
    sublabel: 'Uma vez',
    value: 'once-a-day',
    suggestedTimes: ['08:00'],
  },
  {
    label: '2× ao dia',
    sublabel: 'De 12 em 12h',
    value: 'a cada 12h',
    suggestedTimes: ['08:00', '20:00'],
  },
  {
    label: '3× ao dia',
    sublabel: 'De 8 em 8h',
    value: 'a cada 8h',
    suggestedTimes: ['08:00', '14:00', '20:00'],
  },
  {
    label: '4× ao dia',
    sublabel: 'De 6 em 6h',
    value: 'a cada 6h',
    suggestedTimes: ['06:00', '12:00', '18:00', '00:00'],
  },
  {
    label: 'A cada 8h',
    sublabel: 'Intervalo fixo',
    value: 'a cada 8h',
    suggestedTimes: ['08:00'],
  },
  {
    label: 'A cada 12h',
    sublabel: 'Intervalo fixo',
    value: 'a cada 12h',
    suggestedTimes: ['08:00'],
  },
  {
    label: 'Semanalmente',
    sublabel: 'Uma vez/semana',
    value: 'once-a-week',
    suggestedTimes: ['08:00'],
  },
  {
    label: 'Se necessário',
    sublabel: 'Sem horário fixo',
    value: 'as-needed',
    suggestedTimes: [],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

interface FrequencyPickerProps {
  value: string;
  onChange: (frequency: string) => void;
  onTimeSuggestion: (times: string[]) => void;
  primaryColor: string;
  surface: string;
  border: string;
  textColor: string;
  textSecondary: string;
}

export const FrequencyPicker: React.FC<FrequencyPickerProps> = ({
  value,
  onChange,
  onTimeSuggestion,
  primaryColor,
  surface,
  border,
  textColor,
  textSecondary,
}) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleSelect = (preset: FrequencyPreset) => {
    onChange(preset.value);
    if (preset.suggestedTimes.length > 0) {
      onTimeSuggestion(preset.suggestedTimes);
    }
    setModalVisible(false);
  };

  // Check which preset matches the current value (if any)
  const activePreset = FREQUENCY_PRESETS.find((p) => p.value === value);

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.selectBtn,
          { borderColor: border, backgroundColor: surface },
        ]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel="Selecionar frequencia"
      >
        <View style={styles.selectTextWrap}>
          <Text style={[styles.selectMainText, { color: textColor }]}>
            {activePreset?.label ?? 'Selecionar frequencia'}
          </Text>
          {!!activePreset?.sublabel && (
            <Text style={[styles.selectSubText, { color: textSecondary }]}>
              {activePreset.sublabel}
            </Text>
          )}
        </View>
        <Ionicons name="chevron-down" size={18} color={textSecondary} />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setModalVisible(false)}
        />
        <View
          style={[
            styles.modalCard,
            { backgroundColor: surface, borderColor: border },
          ]}
        >
          {FREQUENCY_PRESETS.map((preset, idx) => {
            const selected =
              preset.value === value && preset.label === activePreset?.label;
            const isLast = idx === FREQUENCY_PRESETS.length - 1;

            return (
              <Pressable
                key={`${preset.label}-${preset.value}`}
                onPress={() => handleSelect(preset)}
                style={[
                  styles.optionRow,
                  {
                    borderBottomColor: border,
                    borderBottomWidth: isLast ? 0 : StyleSheet.hairlineWidth,
                  },
                ]}
                accessibilityRole="button"
                accessibilityState={{ selected }}
                accessibilityLabel={`${preset.label} - ${preset.sublabel}`}
              >
                <View style={styles.optionTextWrap}>
                  <Text
                    style={[
                      styles.optionMainText,
                      { color: selected ? primaryColor : textColor },
                    ]}
                  >
                    {preset.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionSubText,
                      { color: selected ? primaryColor + 'cc' : textSecondary },
                    ]}
                  >
                    {preset.sublabel}
                  </Text>
                </View>
                {selected ? (
                  <Ionicons name="checkmark" size={18} color={primaryColor} />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </Modal>

      {activePreset?.suggestedTimes &&
        activePreset.suggestedTimes.length > 0 && (
          <Text style={[styles.hint, { color: textSecondary }]}>
            Horários sugeridos aplicados automaticamente. Você pode ajustá-los
            abaixo.
          </Text>
        )}
    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  selectBtn: {
    minHeight: 48,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  selectMainText: {
    fontSize: 15,
    fontWeight: '600',
  },
  selectSubText: {
    fontSize: 12,
    marginTop: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#00000040',
  },
  modalCard: {
    position: 'absolute',
    top: 220,
    left: 20,
    right: 20,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  optionRow: {
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTextWrap: {
    flex: 1,
    paddingRight: 8,
  },
  optionMainText: {
    fontSize: 14,
    fontWeight: '600',
  },
  optionSubText: {
    fontSize: 12,
    marginTop: 1,
  },
  hint: {
    fontSize: 12,
    marginTop: 8,
    lineHeight: 17,
    fontStyle: 'italic',
  },
});
