/**
 * StartDatePicker — seletor de data de inicio com atalhos e modal tipo drum-roll.
 */
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ColumnPicker, ITEM_H } from './ColumnPicker';

const DAYS = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, '0')
);

const MONTHS = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 6 }, (_, i) => String(CURRENT_YEAR + i));

function dateToIndices(date: Date): {
  dIdx: number;
  moIdx: number;
  yIdx: number;
} {
  const dIdx = Math.max(0, date.getDate() - 1);
  const moIdx = date.getMonth();
  const yIdx = Math.max(
    0,
    Math.min(YEARS.indexOf(String(date.getFullYear())), YEARS.length - 1)
  );
  return { dIdx, moIdx, yIdx };
}

function indicesToDate(dIdx: number, moIdx: number, yIdx: number): Date {
  const year = Number.parseInt(YEARS[yIdx] ?? String(CURRENT_YEAR), 10);
  const month = moIdx;
  const day = Math.min(dIdx + 1, new Date(year, month + 1, 0).getDate());
  return new Date(year, month, day);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

interface StartDatePickerProps {
  startDate: Date;
  onChange: (date: Date) => void;
  primaryColor: string;
  surface: string;
  border: string;
  textColor: string;
  textSecondary: string;
  background: string;
}

export const StartDatePicker: React.FC<Readonly<StartDatePickerProps>> = ({
  startDate,
  onChange,
  primaryColor,
  surface,
  border,
  textColor,
  textSecondary,
  background,
}) => {
  const [modalVisible, setModalVisible] = useState(false);

  const initialIndices = useMemo(() => dateToIndices(startDate), [startDate]);
  const [dIdx, setDIdx] = useState(initialIndices.dIdx);
  const [moIdx, setMoIdx] = useState(initialIndices.moIdx);
  const [yIdx, setYIdx] = useState(initialIndices.yIdx);

  const openPicker = () => {
    const indices = dateToIndices(startDate);
    setDIdx(indices.dIdx);
    setMoIdx(indices.moIdx);
    setYIdx(indices.yIdx);
    setModalVisible(true);
  };

  const setQuickDate = (deltaDays: number) => {
    const d = new Date();
    d.setDate(d.getDate() + deltaDays);
    onChange(d);
  };

  const confirmDate = () => {
    onChange(indicesToDate(dIdx, moIdx, yIdx));
    setModalVisible(false);
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.dateBtn,
          { borderColor: primaryColor, backgroundColor: primaryColor + '10' },
        ]}
        onPress={openPicker}
        activeOpacity={0.8}
      >
        <Ionicons name="calendar-outline" size={18} color={primaryColor} />
        <Text style={[styles.dateBtnText, { color: primaryColor }]}>
          {formatDate(startDate)}
        </Text>
        <Ionicons name="chevron-down" size={16} color={primaryColor} />
      </TouchableOpacity>

      <View style={styles.quickRow}>
        <TouchableOpacity
          style={[
            styles.quickBtn,
            { borderColor: border, backgroundColor: surface },
          ]}
          onPress={() => setQuickDate(0)}
        >
          <Text style={[styles.quickBtnText, { color: textColor }]}>Hoje</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.quickBtn,
            { borderColor: border, backgroundColor: surface },
          ]}
          onPress={() => setQuickDate(1)}
        >
          <Text style={[styles.quickBtnText, { color: textColor }]}>
            Amanha
          </Text>
        </TouchableOpacity>
      </View>

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
            Data de inicio
          </Text>

          <View style={styles.pickersRow}>
            <View style={styles.pickerCol}>
              <Text style={[styles.pickerLabel, { color: textSecondary }]}>
                Dia
              </Text>
              <ColumnPicker
                items={DAYS}
                selectedIndex={dIdx}
                onSelect={setDIdx}
                textColor={textColor}
                selectedColor={primaryColor}
                surfaceColor={surface}
                width={70}
              />
            </View>
            <View style={styles.pickerCol}>
              <Text style={[styles.pickerLabel, { color: textSecondary }]}>
                Mes
              </Text>
              <ColumnPicker
                items={MONTHS}
                selectedIndex={moIdx}
                onSelect={setMoIdx}
                textColor={textColor}
                selectedColor={primaryColor}
                surfaceColor={surface}
                width={90}
              />
            </View>
            <View style={styles.pickerCol}>
              <Text style={[styles.pickerLabel, { color: textSecondary }]}>
                Ano
              </Text>
              <ColumnPicker
                items={YEARS}
                selectedIndex={yIdx}
                onSelect={setYIdx}
                textColor={textColor}
                selectedColor={primaryColor}
                surfaceColor={surface}
                width={80}
              />
            </View>
          </View>

          <Text style={[styles.preview, { color: primaryColor }]}>
            {formatDate(indicesToDate(dIdx, moIdx, yIdx))}
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
              onPress={confirmDate}
            >
              <Text style={[styles.btnText, { color: '#fff' }]}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  dateBtnText: { flex: 1, fontSize: 15, fontWeight: '600' },
  quickRow: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
  },
  quickBtn: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  quickBtnText: {
    fontSize: 13,
    fontWeight: '600',
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
    marginBottom: 20,
  },
  pickersRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-end',
    marginBottom: 16,
    height: ITEM_H * 5 + 24,
  },
  pickerCol: { alignItems: 'center', gap: 8 },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  preview: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
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
  cancelBtn: { borderWidth: StyleSheet.hairlineWidth },
  btnText: { fontSize: 15, fontWeight: '700' },
});
