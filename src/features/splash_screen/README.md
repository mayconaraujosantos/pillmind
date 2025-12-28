# Splash Screen Feature

Implementação profissional de splash screen com animações suaves e gerenciamento de estado robusto.

## Estrutura

```
splash_screen/
├── presentation/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── SplashLogo.tsx   # Logo com animações
│   │   └── SplashLoader.tsx # Loader animado
│   ├── constants/          # Constantes da feature
│   │   └── splashScreen.constants.ts
│   ├── hooks/              # Hooks customizados
│   │   └── useSplashScreen.ts
│   └── screens/             # Telas
│       └── SplashScreen.tsx
└── index.ts
```

## Características

- ✅ Animações suaves (fade-in, scale)
- ✅ Hook customizado para gerenciamento de estado
- ✅ Componentes reutilizáveis e testáveis
- ✅ Constantes centralizadas
- ✅ Tratamento de erros
- ✅ Performance otimizada com useNativeDriver
- ✅ Design profissional e moderno

## Uso

```typescript
import { SplashScreenComponent } from '@features/splash_screen';

<SplashScreenComponent onFinish={() => setIsReady(true)} />
```

## Customização

As constantes podem ser ajustadas em `constants/splashScreen.constants.ts`:

- Tempo mínimo de exibição
- Duração das animações
- Cores
- Textos
