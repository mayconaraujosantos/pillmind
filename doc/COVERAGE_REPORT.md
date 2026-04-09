# 📊 Relatório de Cobertura de Testes - PillMind

**Data:** 2025-12-30
**Cobertura Geral:** 64.43% (Statements) | 39.09% (Branches) | 55.38% (Functions) | 64.28% (Lines)

## 📈 Resumo Geral

| Métrica        | Cobertura |
| -------------- | --------- |
| **Statements** | 64.43%    |
| **Branches**   | 39.09%    |
| **Functions**  | 55.38%    |
| **Lines**      | 64.28%    |

## ✅ Arquivos com 100% de Cobertura

- ✅ `src/core/config/index.ts` - 100%
- ✅ `src/shared/constants/index.ts` - 100%
- ✅ `src/shared/utils/validators.ts` - 100%
- ✅ `src/shared/utils/formatters.ts` - 100%
- ✅ `src/shared/components/BaseScreen.tsx` - 100%
- ✅ `src/shared/components/Card.tsx` - 100%
- ✅ `src/features/account/presentation/screens/AccountScreen.tsx` - 100%
- ✅ `src/features/appointments/presentation/screens/AppointmentsScreen.tsx` - 100%
- ✅ `src/features/nearby/presentation/screens/NearbyScreen.tsx` - 100%
- ✅ `src/features/parental/presentation/screens/ParentalScreen.tsx` - 100%
- ✅ `src/features/onboarding/presentation/components/OnboardingCarousel.tsx` - 100%
- ✅ `src/features/onboarding/presentation/components/OnboardingFooter.tsx` - 100%
- ✅ `src/features/onboarding/presentation/components/OnboardingHeader.tsx` - 100%
- ✅ `src/features/onboarding/presentation/components/OnboardingIndicator.tsx` - 100%
- ✅ `src/features/onboarding/presentation/components/OnboardingStep.tsx` - 100%
- ✅ `src/features/onboarding/presentation/components/OnboardingView.tsx` - 100% (50% branches)
- ✅ `src/features/onboarding/presentation/screens/OnboardingContainer.tsx` - 100%

## ⚠️ Arquivos com Baixa Cobertura (0%)

### Arquivos Principais sem Testes:

- ❌ `App.tsx` - 0% (12-78 linhas não cobertas)
- ❌ `src/features/home/presentation/screens/HomeScreen.tsx` - 0% (7-40 linhas não cobertas)
- ❌ `src/features/onboarding/presentation/screens/OnboardingScreen.tsx` - 0% (25-142 linhas não cobertas)

### Entidades de Domínio sem Testes:

- ❌ `src/features/appointments/domain/entities/Appointment.ts` - 0%
- ❌ `src/features/home/domain/entities/Medicine.ts` - 0%
- ❌ `src/features/home/domain/repositories/MedicineRepository.ts` - 0%
- ❌ `src/features/home/domain/useCases/CreateMedicineUseCase.ts` - 0%
- ❌ `src/features/home/domain/useCases/GetMedicinesUseCase.ts` - 0%

## 🔶 Arquivos com Cobertura Parcial

### Componentes Compartilhados:

- 🔶 `src/shared/components/Button.tsx` - 66.66% (linha 27 não coberta)
- 🔶 `src/shared/components/Header.tsx` - 50% (linhas 19-21 não cobertas)
- 🔶 `src/shared/components/Input.tsx` - 66.66% (linha 21 não coberta)
- 🔶 `src/shared/components/ScreenWrapper.tsx` - 66.66% (linha 13 não coberta)

### Splash Screen:

- 🔶 `src/features/splash_screen/presentation/screens/SplashScreen.tsx` - 87.5% (linha 37 não coberta)
- 🔶 `src/features/splash_screen/presentation/components/SplashLoader.tsx` - 33.33% (linhas 16-27 não cobertas)
- 🔶 `src/features/splash_screen/presentation/components/SplashLogo.tsx` - 25% (linhas 14-37 não cobertas)
- 🔶 `src/features/splash_screen/presentation/hooks/useSplashScreen.ts` - 56% (linhas 34-39, 47-55, 62 não cobertas)

## 🎯 Recomendações para Melhorar a Cobertura

### Prioridade Alta:

1. **App.tsx** - Arquivo principal da aplicação, precisa de testes
2. **HomeScreen.tsx** - Tela principal, importante ter cobertura
3. **Estrutura `app/` do expo-router** - Navegação principal, precisa de mais testes
4. **Entidades de Domínio** - Medicine, Appointment precisam de testes unitários

### Prioridade Média:

1. **useSplashScreen.ts** - Completar testes do hook (linhas 34-39, 47-55, 62)
2. **SplashLoader.tsx** e **SplashLogo.tsx** - Componentes de splash screen
3. **Componentes Compartilhados** - Button, Header, Input, ScreenWrapper

### Prioridade Baixa:

1. **OnboardingScreen.tsx** - Parece ser um arquivo legado (OnboardingContainer já tem 100%)

## 📝 Notas

- O SonarCloud está configurado e será executado automaticamente via GitHub Actions
- O relatório de cobertura é gerado em `coverage/lcov.info`
- Para visualizar o relatório HTML: abra `coverage/lcov-report/index.html` no navegador
- Para verificar no SonarCloud: https://sonarcloud.io/project/overview?id=mayconaraujosantos_pillmind

## 🔗 Links Úteis

- **SonarCloud Dashboard:** https://sonarcloud.io/project/overview?id=mayconaraujosantos_pillmind
- **Relatório Local:** `coverage/lcov-report/index.html`
- **Documentação SonarQube:** `docs/SONARQUBE.md`
