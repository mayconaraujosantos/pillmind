# Path Aliases

Este projeto utiliza path aliases para facilitar os imports e melhorar a legibilidade do código.

## Aliases Configurados

### `@shared`
Componentes, utilitários, tipos e constantes compartilhados.

**Exemplo:**
```typescript
import { Button, Card, Input } from '@shared/components';
import { formatDate, formatTime } from '@shared/utils';
import { isValidEmail } from '@shared/utils/validators';
```

### `@features`
Features do aplicativo (Home, Appointments, Account, Parental, Nearby).

**Exemplo:**
```typescript
import { HomeScreen } from '@features/home/presentation/screens/HomeScreen';
import { Medicine } from '@features/home/domain/entities/Medicine';
import { GetMedicinesUseCase } from '@features/home/domain/useCases';
```

### `@core`
Configurações centrais da aplicação (navegação, config).

**Exemplo:**
```typescript
import { AppNavigator } from '@core/navigation/AppNavigator';
import { config } from '@core/config';
```

### `@src`
Raiz do diretório `src` (uso geral).

**Exemplo:**
```typescript
import { something } from '@src/some/path';
```

## Configuração

### TypeScript (`tsconfig.json`)
Os aliases estão configurados em `compilerOptions.paths` para que o TypeScript reconheça os imports.

### Metro Bundler (`babel.config.js`)
O `babel-plugin-module-resolver` está configurado para que o Metro bundler resolva os aliases em tempo de execução.

## Benefícios

1. **Imports mais limpos**: Não precisa mais de `../../../shared/components`
2. **Refatoração mais fácil**: Se mover um arquivo, os imports não quebram
3. **Melhor legibilidade**: Fica claro de onde vem cada import
4. **Autocomplete melhor**: IDEs conseguem sugerir melhor os imports

## Antes e Depois

### Antes (imports relativos)
```typescript
import { Card } from '../../../shared/components';
import { HomeScreen } from '../../features/home/presentation/screens/HomeScreen';
```

### Depois (com aliases)
```typescript
import { Card } from '@shared/components';
import { HomeScreen } from '@features/home/presentation/screens/HomeScreen';
```

