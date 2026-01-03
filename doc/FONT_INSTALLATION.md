# Instalação de Fontes - PillMind

## 🎯 Objetivo

Configurar a fonte Roboto para garantir consistência visual entre iOS e Android.

## 📥 Opções de Instalação

### Opção 1: Usar @expo-google-fonts (Recomendado) ✅

Esta é a forma mais simples e recomendada.

#### 1. Instalar o pacote

```bash
npx expo install @expo-google-fonts/roboto
```

#### 2. Atualizar o arquivo `src/shared/hooks/useFonts.ts`

Substitua o conteúdo por:

```typescript
import {
  useFonts as useGoogleFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

export function useFonts() {
  const [fontsLoaded] = useGoogleFonts({
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-Bold': Roboto_700Bold,
  });

  return { fontsLoaded, error: null };
}
```

#### 3. Atualizar `src/shared/theme/typography.ts`

Se necessário, ajuste os nomes das fontes:

```typescript
export const fontFamily = {
  regular: 'Roboto-Regular',
  medium: 'Roboto-Medium',
  semibold: 'Roboto-Bold', // Roboto não tem semibold oficial
  bold: 'Roboto-Bold',
} as const;
```

### Opção 2: Fontes Locais (Download Manual)

Se preferir ter controle total sobre os arquivos de fonte.

#### 1. Baixar as fontes

1. Acesse https://fonts.google.com/specimen/Roboto
2. Clique em "Download family"
3. Extraia os seguintes arquivos:
   - `Roboto-Regular.ttf`
   - `Roboto-Medium.ttf`
   - `Roboto-Bold.ttf`

#### 2. Colocar na pasta assets

```
assets/
└── fonts/
    ├── Roboto-Regular.ttf
    ├── Roboto-Medium.ttf
    └── Roboto-Bold.ttf
```

#### 3. Atualizar `src/shared/hooks/useFonts.ts`

Descomente a OPÇÃO 1 no arquivo:

```typescript
await Font.loadAsync({
  'Roboto-Regular': require('../../assets/fonts/Roboto-Regular.ttf'),
  'Roboto-Medium': require('../../assets/fonts/Roboto-Medium.ttf'),
  'Roboto-Bold': require('../../assets/fonts/Roboto-Bold.ttf'),
});
```

### Opção 3: Usar Fontes do Sistema (Desenvolvimento)

Para desenvolvimento rápido, pode usar as fontes padrão:

- Android: Roboto (já vem instalada)
- iOS: San Francisco

Não precisa fazer nada, já está configurado por padrão.

## ⚠️ Observação sobre Semibold

A fonte Roboto não possui um peso Semibold (600) oficial. Nossa solução:

1. **Usar Bold (700)** para textos que pedem Semibold
2. Ou ajustar o sistema de tipografia para usar apenas Regular, Medium e Bold

## 🧪 Testando

Após instalar, execute:

```bash
npm start
```

E verifique se:

1. O app carrega sem erros
2. Os textos aparecem corretamente
3. A tipografia está consistente em ambas as plataformas

## 🔍 Troubleshooting

### Erro: "fontFamily 'Roboto' is not a system font"

**Solução**: Instale @expo-google-fonts/roboto ou coloque os arquivos .ttf em assets/fonts/

### App trava no carregamento

**Solução**: Verifique se os caminhos dos arquivos estão corretos no useFonts.ts

### Fontes não carregam no iOS

**Solução**:

1. Limpe o cache: `npx expo start --clear`
2. Rebuild do app: `npx expo run:ios`

## 📚 Referências

- [Expo Font Documentation](https://docs.expo.dev/versions/latest/sdk/font/)
- [Expo Google Fonts](https://github.com/expo/google-fonts)
- [Google Fonts - Roboto](https://fonts.google.com/specimen/Roboto)
- [React Native Typography](https://reactnative.dev/docs/text-style-props#fontfamily)

## ✅ Status Atual

- ✅ Estrutura de pastas criada
- ✅ Hook useFonts configurado
- ✅ App.tsx atualizado
- ⏳ **Aguardando**: Instalação da fonte (escolher uma das opções acima)

---

**Recomendação**: Use a **Opção 1** (@expo-google-fonts) por ser mais simples e manter as fontes sempre atualizadas.
