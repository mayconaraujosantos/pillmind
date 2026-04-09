/**
 * TimePicker — visual time chips + drum-roll modal picker.
 * No external library required.
 */
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColumnPicker, ITEM_H } from './ColumnPicker';

// ─── Data ────────────────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, '0')
);

function snapMinute(mm: string): string {
  const n = parseInt(mm, 10);
  return String(
    Math.round(n / 5) * 5 === 60 ? 55 : Math.round(n / 5) * 5
  ).padStart(2, '0');
}

function parseTime(t: string): { hIdx: number; mIdx: number } {
  const [hh = '08', mm = '00'] = t.split(':');
  const hIdx = Math.max(0, HOURS.indexOf(hh.padStart(2, '0')));
  const snapped = snapMinute(mm);
  const mIdx = Math.max(0, MINUTES.indexOf(snapped));
  return { hIdx, mIdx };
}

// ─── Components ──────────────────────────────────────────────────────────────

interface TimePickerProps {
  times: string[];
  onChange: (times: string[]) => void;
  primaryColor: string;
  surface: string;
  border: string;
  textColor: string;
  textSecondary: string;
  background: string;
  maxTimes?: number;
}

export const TimePicker: React.FC<TimePickerProps> = ({
  times,
  onChange,
  primaryColor,
  surface,
  border,
  textColor,
  textSecondary,
  background,
  maxTimes = 6,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hIdx, setHIdx] = useState(8); // default 08:xx
  const [mIdx, setMIdx] = useState(0); // default xx:00

  const openAdd = () => {
    setEditingIndex(null);
    setHIdx(8);
    setMIdx(0);
    setModalVisible(true);
  };

  const openEdit = (index: number) => {
    const { hIdx: h, mIdx: m } = parseTime(times[index] ?? '08:00');
    setEditingIndex(index);
    setHIdx(h);
    setMIdx(m);
    setModalVisible(true);
  };

  const removeTime = useCallback(
    (index: number) => {
      onChange(times.filter((_, i) => i !== index));
    },
    [times, onChange]
  );

  const confirmTime = () => {
    const timeStr = `${HOURS[hIdx]}:${MINUTES[mIdx]}`;
    if (editingIndex !== null) {
      const next = [...times];
      next[editingIndex] = timeStr;
      onChange(next.sort());
    } else {
      if (!times.includes(timeStr)) {
        onChange([...times, timeStr].sort());
      }
    }
    setModalVisible(false);
  };

  return (
    <View>
      <View style={styles.chipsRow}>
        {times.map((t, i) => (
          <TouchableOpacity
            key={t}
            style={[
              styles.chip,
              {
                borderColor: primaryColor,
                backgroundColor: primaryColor + '18',
              },
            ]}
            onPress={() => openEdit(i)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipText, { color: primaryColor }]}>{t}</Text>
            <Pressable
              hitSlop={8}
              onPress={() => removeTime(i)}
              accessibilityLabel={`Remover ${t}`}
            >
              <Ionicons name="close-circle" size={16} color={primaryColor} />
            </Pressable>
          </TouchableOpacity>
        ))}

        {times.length < maxTimes && (
          <TouchableOpacity
            style={[
              styles.addChip,
              { borderColor: border, backgroundColor: surface },
            ]}
            onPress={openAdd}
            activeOpacity={0.75}
            accessibilityLabel="Adicionar horário"
          >
            <Ionicons name="add" size={18} color={textSecondary} />
            <Text style={[styles.addChipText, { color: textSecondary }]}>
              Horário
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {times.length === 0 && (
        <Text style={[styles.hint, { color: textSecondary }]}>
          Toque em "+ Horário" para adicionar quando tomar este medicamento.
        </Text>
      )}

      {/* Time picker modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setModalVisible(false)}
        />
        <View style={[styles.sheet, { backgroundColor: background }]}>
          <View style={[styles.handle, { backgroundColor: border }]} />
          <Text style={[styles.sheetTitle, { color: textColor }]}>
            {editingIndex !== null ? 'Editar horário' : 'Adicionar horário'}
          </Text>

          {/* Drum-roll pickers */}
          <View style={styles.pickersRow}>
            <ColumnPicker
              items={HOURS}
              selectedIndex={hIdx}
              onSelect={setHIdx}
              textColor={textColor}
              selectedColor={primaryColor}
              surfaceColor={surface}
              width={100}
            />
            <Text style={[styles.colon, { color: primaryColor }]}>:</Text>
            <ColumnPicker
              items={MINUTES}
              selectedIndex={mIdx}
              onSelect={setMIdx}
              textColor={textColor}
              selectedColor={primaryColor}
              surfaceColor={surface}
              width={100}
            />
          </View>

          <Text style={[styles.preview, { color: primaryColor }]}>
            {HOURS[hIdx]}:{MINUTES[mIdx]}
          </Text>

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn, { borderColor: border }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.btnText, { color: textSecondary }]}>
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: primaryColor }]}
              onPress={confirmTime}
            >
              <Text style={[styles.btnText, { color: '#fff' }]}>
                {editingIndex !== null ? 'Salvar' : 'Adicionar'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '600',
    fontVariant: ['tabular-nums'],
  },
  addChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderStyle: 'dashed',
  },
  addChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 17,
  },
  backdrop: {
    flex: 1,
    backgroundColor: '#00000055',
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 24,
  },
  pickersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    height: ITEM_H * 5,
  },
  colon: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  preview: {
    fontSize: 36,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginBottom: 24,
    letterSpacing: 2,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  btnText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
