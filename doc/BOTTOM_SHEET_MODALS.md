# Bottom Sheet Modals - Generic Components

Este documento descreve os componentes genéricos de modal bottom sheet criados para reutilização em todo o aplicativo.

## 🎯 Componentes Disponíveis

### 1. BottomSheetPicker (Generic)

Componente base genérico para criar modals de seleção com bottom sheet.

**Localização:** `src/shared/components/BottomSheetPicker.tsx`

**Uso:**

```tsx
import {
  BottomSheetPicker,
  PickerOption,
} from '@shared/components/BottomSheetPicker';

const options: PickerOption<string>[] = [
  { value: 'option1', label: 'Option 1', icon: 'checkmark' },
  { value: 'option2', label: 'Option 2' },
];

<BottomSheetPicker
  visible={true}
  title="Choose Option"
  options={options}
  selectedValue={selectedValue}
  onSelect={(value) => console.log(value)}
  onClose={() => setVisible(false)}
  doneButtonText="Done"
/>;
```

**Props:**

- `visible: boolean` - Controla visibilidade do modal
- `title: string` - Título do modal
- `options: PickerOption<T>[]` - Array de opções
- `selectedValue?: T` - Valor selecionado
- `onSelect: (value: T) => void` - Callback ao selecionar
- `onClose: () => void` - Callback ao fechar
- `doneButtonText?: string` - Texto do botão (padrão: "Done")

**PickerOption:**

```tsx
interface PickerOption<T> {
  value: T; // Valor da opção
  label: string; // Texto exibido
  icon?: string; // Ícone opcional (Ionicons)
}
```

---

### 2. GenderPickerModal

Modal para seleção de gênero.

**Localização:** `src/features/account/presentation/components/GenderPickerModal.tsx`

**Uso:**

```tsx
import { GenderPickerModal, Gender } from '../components/GenderPickerModal';

<GenderPickerModal
  visible={showGenderPicker}
  selectedGender={formData.gender}
  onSelect={(gender) => setFormData({ ...formData, gender })}
  onClose={() => setShowGenderPicker(false)}
/>;
```

**Props:**

- `visible: boolean`
- `selectedGender: Gender` - 'male' | 'female' | 'non-binary' | ''
- `onSelect: (gender: Gender) => void`
- `onClose: () => void`

---

### 3. ImageSourcePickerModal

Modal para escolher entre câmera ou galeria.

**Localização:** `src/features/account/presentation/components/ImageSourcePickerModal.tsx`

**Uso:**

```tsx
import {
  ImageSourcePickerModal,
  ImageSource,
} from '../components/ImageSourcePickerModal';

<ImageSourcePickerModal
  visible={showImagePicker}
  onSelect={(source) => {
    if (source === 'camera') {
      // Abrir câmera
    } else if (source === 'gallery') {
      // Abrir galeria
    }
  }}
  onClose={() => setShowImagePicker(false)}
/>;
```

**Props:**

- `visible: boolean`
- `onSelect: (source: ImageSource) => void` - 'camera' | 'gallery'
- `onClose: () => void`

**Features:**

- Ícones customizados (câmera e galeria)
- Traduções em PT-BR e EN

---

### 4. DatePickerModal

Modal para seleção de data de nascimento.

**Localização:** `src/features/account/presentation/components/DatePickerModal.tsx`

**Uso:**

```tsx
import { DatePickerModal } from '../components/DatePickerModal';

<DatePickerModal
  visible={showDatePicker}
  selectedDate={selectedDate}
  onSelect={(date) => {
    setSelectedDate(date);
    setShowDatePicker(false);
  }}
  onClose={() => setShowDatePicker(false)}
  maximumDate={new Date()}
  minimumDate={new Date(1900, 0, 1)}
/>;
```

**Props:**

- `visible: boolean`
- `selectedDate?: Date`
- `onSelect: (date: Date) => void`
- `onClose: () => void`
- `minimumDate?: Date`
- `maximumDate?: Date`

**Comportamento:**

- **iOS:** Bottom sheet com spinner
- **Android:** Native date picker dialog

---

## 🎨 Design Pattern

Todos os modals seguem o mesmo padrão de design:

1. **Handle bar** no topo para indicar que pode ser arrastado
2. **Título centralizado** com botão X à direita
3. **Opções centralizadas** com espaçamento adequado
4. **Botão "Done"** azul na parte inferior
5. **Backdrop escuro** (50% opacity) que fecha o modal ao clicar
6. **Animação slide** de baixo para cima

---

## 🌐 Traduções

Todas as traduções estão em:

- `src/shared/i18n/locales/en.json`
- `src/shared/i18n/locales/pt-BR.json`

**Keys disponíveis:**

```json
{
  "common": {
    "done": "Done",
    "cancel": "Cancel"
  },
  "profile": {
    "chooseGender": "Choose Gender",
    "genderMale": "Male",
    "genderFemale": "Female",
    "genderNonBinary": "Non-binary",
    "changePhoto": "Change Photo",
    "takePhoto": "Take Photo",
    "chooseFromGallery": "Choose from Gallery",
    "selectDateOfBirth": "Select Date of Birth"
  }
}
```

---

## 🧪 Testes

Exemplo de teste para o componente genérico:

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { BottomSheetPicker } from '@shared/components/BottomSheetPicker';

it('should call onSelect when option is pressed', () => {
  const mockOnSelect = jest.fn();
  const options = [{ value: 'test', label: 'Test Option' }];

  const { getByText } = render(
    <BottomSheetPicker
      visible={true}
      title="Test"
      options={options}
      onSelect={mockOnSelect}
      onClose={jest.fn()}
    />
  );

  fireEvent.press(getByText('Test Option'));
  expect(mockOnSelect).toHaveBeenCalledWith('test');
});
```

---

## 📦 Dependências

- `@expo/vector-icons` - Ícones
- `@react-native-community/datetimepicker` - Date picker nativo
- `react-native-gesture-handler` - Gestos (stack navigation)

---

## ✨ Boas Práticas

1. **Sempre use o componente genérico** `BottomSheetPicker` quando possível
2. **Crie wrappers específicos** para casos de uso comuns (GenderPicker, etc.)
3. **Adicione traduções** para todas as strings visíveis
4. **Teste no iOS e Android** - comportamentos podem variar
5. **Use TypeScript generics** para type safety
6. **Documente props** e exemplos de uso

---

## 🔄 Próximos Passos

Componentes que podem usar este padrão:

- Language Picker (seleção de idioma)
- Theme Picker (seleção de tema)
- Medication Frequency Picker
- Reminder Time Picker
- Any other selection modal

---

## 📝 Exemplo Completo

```tsx
import React, { useState } from 'react';
import {
  BottomSheetPicker,
  PickerOption,
} from '@shared/components/BottomSheetPicker';

export const MyComponent = () => {
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<string>('');

  const options: PickerOption<string>[] = [
    { value: 'opt1', label: 'Option 1', icon: 'heart' },
    { value: 'opt2', label: 'Option 2', icon: 'star' },
    { value: 'opt3', label: 'Option 3' },
  ];

  return (
    <>
      <Button onPress={() => setVisible(true)}>Open Picker</Button>

      <BottomSheetPicker
        visible={visible}
        title="Choose an Option"
        options={options}
        selectedValue={selected}
        onSelect={(value) => {
          setSelected(value);
          setVisible(false);
        }}
        onClose={() => setVisible(false)}
        doneButtonText="Confirm"
      />
    </>
  );
};
```
