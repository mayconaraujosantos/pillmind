# 📋 Recomendações de Exclusões para SonarQube

## Arquivos que podem ser excluídos da análise do SonarQube

### 1. Arquivos Index (Barrel Exports) - 0% de cobertura

Estes arquivos apenas re-exportam outros módulos e não contêm lógica de negócio:

```
**/index.ts
```

**Arquivos específicos:**

- `src/shared/components/index.ts` - apenas exports
- `src/shared/utils/index.ts` - apenas exports
- `src/shared/constants/index.ts` - apenas exports
- `src/shared/assets/index.ts` - apenas imports de assets
- `src/shared/types/index.ts` - apenas tipos TypeScript
- `src/features/onboarding/index.ts` - apenas exports
- `src/features/onboarding/presentation/components/index.ts` - apenas exports
- `src/features/splash_screen/index.ts` - apenas exports
- `src/features/splash_screen/presentation/components/index.ts` - apenas exports
- `src/features/home/domain/useCases/index.ts` - apenas exports
- `src/core/config/index.ts` - apenas exports (mas tem 100% de cobertura, então pode manter)

### 2. Arquivos de Tipos TypeScript - 0% de cobertura

Arquivos que apenas definem tipos/interfaces, não precisam de cobertura:

```
**/types.ts
**/types/*.ts
```

**Arquivos específicos:**

- `src/core/navigation/types.ts` - apenas definições de tipos de navegação
- `src/shared/types/index.ts` - tipos utilitários (Nullable, Optional)

### 3. Arquivos de Configuração/Setup

Arquivos de configuração que não contêm lógica de negócio:

```
index.ts (raiz)
App.tsx (pode ser excluído se não for testável facilmente)
```

**Arquivos específicos:**

- `index.ts` (raiz) - apenas configuração do Expo/React Native

### 4. Arquivos Legados (Opcional)

Arquivos que não são mais usados ou foram substituídos:

```
**/OnboardingScreen.tsx (se OnboardingContainer for o componente ativo)
```

**Arquivos específicos:**

- `src/features/onboarding/presentation/screens/OnboardingScreen.tsx` - 0% cobertura, parece ser legado já que `OnboardingContainer.tsx` tem 100%

### 5. Arquivos de Assets

Arquivos que apenas importam assets estáticos:

```
**/assets/index.ts
```

**Arquivos específicos:**

- `src/shared/assets/index.ts` - apenas imports de imagens/assets

## 📝 Configuração Recomendada

### Para `sonar.exclusions` (excluir da análise completa):

```properties
sonar.exclusions=**/node_modules/**,**/build/**,**/coverage/**,**/*.min.js,**/android/**,**/ios/**,**/Pods/**,**/index.ts,**/types.ts
```

### Para `sonar.coverage.exclusions` (excluir apenas da cobertura):

```properties
sonar.coverage.exclusions=**/__tests__/**,**/*.test.ts,**/*.test.tsx,**/*.spec.ts,**/*.spec.tsx,**/coverage/**,**/*.config.js,**/*.config.ts,**/index.ts,**/types.ts,**/assets/index.ts,index.ts,App.tsx
```

## 🎯 Justificativa

### Por que excluir `index.ts`?

- São arquivos "barrel exports" que apenas re-exportam outros módulos
- Não contêm lógica de negócio testável
- A cobertura real está nos arquivos que eles exportam
- Excluí-los melhora a métrica geral sem perder informação relevante

### Por que excluir `types.ts`?

- Apenas definições TypeScript (interfaces, types)
- Não contêm lógica executável
- TypeScript já valida esses tipos em tempo de compilação
- Não faz sentido ter cobertura de código que não executa

### Por que excluir `assets/index.ts`?

- Apenas imports de assets estáticos (imagens, etc.)
- Não contêm lógica de negócio
- Assets são validados em tempo de build, não em runtime

### Por que excluir `App.tsx`? (Opcional)

- Arquivo de entrada da aplicação
- Geralmente difícil de testar isoladamente
- Se não for crítico para a métrica, pode ser excluído
- **Nota:** Se você planeja testar o App.tsx, mantenha-o na análise

## ⚠️ Arquivos que NÃO devem ser excluídos

Mesmo com 0% de cobertura, estes arquivos devem permanecer na análise:

- ❌ `HomeScreen.tsx` - Tela principal, precisa de testes
- ❌ `AppNavigator.tsx` - Navegação principal, precisa de mais testes
- ❌ `Medicine.ts`, `Appointment.ts` - Entidades de domínio, precisam de testes
- ❌ `MedicineRepository.ts` - Repositório, precisa de testes
- ❌ Use Cases - Lógica de negócio, precisa de testes

## 📊 Impacto Esperado

Após aplicar essas exclusões:

- **Cobertura geral deve aumentar** (removendo arquivos que não deveriam ser medidos)
- **Métricas mais precisas** (focando em código que realmente precisa de testes)
- **Menos "ruído"** no dashboard do SonarCloud

## 🔄 Como Aplicar

1. Edite `sonar-project.properties`
2. Adicione os padrões recomendados acima
3. Execute `npm run test:coverage` para verificar
4. Faça push e verifique no SonarCloud
