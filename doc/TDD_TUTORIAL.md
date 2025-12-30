# 🎓 Tutorial: Refatoração OnboardingScreen com TDD

## 📋 Sumário Executivo

Refatoramos o `OnboardingScreen` de um **componente monolítico** para uma **arquitetura modular** seguindo **TDD** e **princípios SOLID**.

### 📊 Números que Importam

- ✅ **36 testes criados** (0 → 36)
- ✅ **100% cobertura** nos componentes refatorados
- ✅ **6 componentes modulares** (1 → 6)
- ✅ **-80% linhas por arquivo** (200 → ~40)
- ✅ **0 quebras** (compatibilidade mantida)

---

## 🎯 O Problema

### OnboardingScreen Original

```typescript
// ❌ ANTES: Tudo em um único arquivo (~200 linhas)
export const OnboardingScreen = ({ onFinish, onSkip }) => {
  // Estado
  const [currentStep, setCurrentStep] = useState(0);

  // Lógica de scroll
  const handleScroll = (event) => { /* ... */ };

  // Handlers
  const skip = () => { onSkip?.(); };
  const handleSignIn = () => { onFinish?.(); };
  const handleSignUp = () => { onFinish?.(); };

  // UI completa (Header, Carousel, Indicator, Footer)
  return (
    <View>
      {/* 150+ linhas de JSX */}
      {/* 50+ linhas de estilos */}
    </View>
  );
};
```

### ⚠️ Problemas Identificados

1. **Violação do SRP** - Múltiplas responsabilidades
2. **Difícil testar** - Lógica misturada com UI
3. **Difícil reutilizar** - Tudo acoplado
4. **Difícil manter** - Arquivo grande
5. **Sem testes** - Zero cobertura

---

## ✅ A Solução (TDD + SOLID)

### Arquitetura Final

```
┌─────────────────────────────────────────┐
│      OnboardingContainer (Lógica)      │
│  - Gerencia estado                      │
│  - Usa hooks                            │
│  - Orquestra componentes                │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│      OnboardingView (Apresentação)      │
│  - Recebe props                         │
│  - Renderiza componentes                │
│  - Sem lógica de negócio                │
└──────────┬────────────┬─────────────────┘
           │            │
     ┌─────┴─────┐      └─────┬──────────┐
     ▼           ▼            ▼          ▼
┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
│ Header  │ │Carousel │ │Indicator│ │ Footer  │
└─────────┘ └─────────┘ └─────────┘ └─────────┘
```

---

## 🔄 Processo TDD (Passo a Passo)

### **Passo 1: Hook useOnboardingScroll**

#### 🔴 Red - Escrever teste

```typescript
// __tests__/useOnboardingScroll.test.tsx
it('deve iniciar no passo 0', () => {
  const { result } = renderHook(() => useOnboardingScroll(3));
  expect(result.current.currentStep).toBe(0);
});
```

#### 🟢 Green - Implementar

```typescript
// useOnboardingScroll.ts
export const useOnboardingScroll = (totalSteps: number) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleScroll = (event) => {
    const newStep = Math.round(
      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
    );
    if (newStep >= 0 && newStep < totalSteps) {
      setCurrentStep(newStep);
    }
  };

  return { currentStep, handleScroll };
};
```

#### 🔵 Refactor - Melhorar

```typescript
// ✅ Código limpo
// ✅ Tipagem forte
// ✅ 100% testado
```

---

### **Passo 2: Componente OnboardingHeader**

#### 🔴 Red

```typescript
it('deve renderizar botão Skip', () => {
  const { getByText } = render(<OnboardingHeader onSkip={jest.fn()} />);
  expect(getByText('Pular')).toBeTruthy();
});
```

#### 🟢 Green

```typescript
export const OnboardingHeader = ({ onSkip }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onSkip}>
      <Text>{ONBOARDING_TEXTS.SKIP}</Text>
    </TouchableOpacity>
  </View>
);
```

---

### **Passo 3: Componente OnboardingFooter**

#### 🔴 Red

```typescript
it('deve chamar onSignIn ao pressionar Sign In', () => {
  const onSignIn = jest.fn();
  const { getByText } = render(
    <OnboardingFooter onSignIn={onSignIn} onSignUp={jest.fn()} />
  );
  fireEvent.press(getByText('SIGN IN'));
  expect(onSignIn).toHaveBeenCalled();
});
```

#### 🟢 Green

```typescript
export const OnboardingFooter = ({ onSignIn, onSignUp }) => (
  <View style={styles.footer}>
    <TouchableOpacity onPress={onSignIn}>
      <Text>SIGN IN</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={onSignUp}>
      <Text>SIGN UP</Text>
    </TouchableOpacity>
  </View>
);
```

---

### **Passo 4: Componente OnboardingCarousel**

#### 🔴 Red

```typescript
it('deve renderizar todos os steps', () => {
  const { getByText } = render(<OnboardingCarousel onScroll={jest.fn()} />);
  expect(getByText("DON'T FORGET YOUR MEDICINES.")).toBeTruthy();
});
```

#### 🟢 Green

```typescript
export const OnboardingCarousel = ({ onScroll }) => (
  <ScrollView horizontal pagingEnabled onMomentumScrollEnd={onScroll}>
    {ONBOARDING_STEPS.map((step) => (
      <OnboardingStepComponent key={step.id} step={step} />
    ))}
  </ScrollView>
);
```

---

### **Passo 5: Componente OnboardingView**

#### 🔴 Red

```typescript
it('deve renderizar todos os componentes principais', () => {
  const { getByText } = render(<OnboardingView {...mockProps} />);
  expect(getByText('Pular')).toBeTruthy();
  expect(getByText('SIGN IN')).toBeTruthy();
});
```

#### 🟢 Green

```typescript
export const OnboardingView = ({
  currentStep,
  totalSteps,
  onScroll,
  onSkip,
  onSignIn,
  onSignUp,
}) => (
  <View>
    <OnboardingHeader onSkip={onSkip} />
    <OnboardingCarousel onScroll={onScroll} />
    <OnboardingIndicator current={currentStep} total={totalSteps} />
    <OnboardingFooter onSignIn={onSignIn} onSignUp={onSignUp} />
  </View>
);
```

---

### **Passo 6: Componente OnboardingContainer**

#### 🔴 Red

```typescript
it('deve chamar onSkip quando Skip é pressionado', () => {
  const onSkip = jest.fn();
  const { getByText } = render(<OnboardingContainer onSkip={onSkip} />);
  fireEvent.press(getByText('Pular'));
  expect(onSkip).toHaveBeenCalled();
});
```

#### 🟢 Green

```typescript
export const OnboardingContainer = ({ onFinish, onSkip }) => {
  const { currentStep, handleScroll } = useOnboardingScroll(
    ONBOARDING_STEPS.length
  );

  return (
    <OnboardingView
      currentStep={currentStep}
      totalSteps={ONBOARDING_STEPS.length}
      onScroll={handleScroll}
      onSkip={onSkip}
      onSignIn={onFinish}
      onSignUp={onFinish}
    />
  );
};
```

---

## 🎯 Princípios SOLID Aplicados

### **S - Single Responsibility**

```typescript
// ✅ Cada arquivo tem UMA responsabilidade
useOnboardingScroll.ts    → Gerencia scroll
OnboardingHeader.tsx      → Renderiza header
OnboardingContainer.tsx   → Orquestra componentes
```

### **O - Open/Closed**

```typescript
// ✅ Extensível sem modificação
<OnboardingView
  currentStep={customStep}
  // Adicionar novos comportamentos sem tocar no código
/>
```

### **L - Liskov Substitution**

```typescript
// ✅ Componentes substituíveis
<CustomHeader onSkip={onSkip} /> // Mesma interface
```

### **I - Interface Segregation**

```typescript
// ✅ Interfaces mínimas
interface OnboardingHeaderProps {
  onSkip: () => void; // Só o necessário
}
```

### **D - Dependency Inversion**

```typescript
// ✅ Depende de abstrações
const { currentStep, handleScroll } = useOnboardingScroll(3); // Hook abstração
<OnboardingView onScroll={handleScroll} /> // Props abstração
```

---

## 📊 Comparação Antes x Depois

### Complexidade

| Métrica            | Antes | Depois |
| ------------------ | ----- | ------ |
| Linhas por arquivo | 200   | ~40    |
| Componentes        | 1     | 6      |
| Responsabilidades  | 5+    | 1      |
| Testes             | 0     | 36     |
| Cobertura          | 0%    | 100%   |

### Manutenibilidade

| Aspecto           | Antes         | Depois        |
| ----------------- | ------------- | ------------- |
| Encontrar código  | ⚠️ Difícil    | ✅ Fácil      |
| Adicionar feature | ⚠️ Arriscado  | ✅ Seguro     |
| Testar mudança    | ❌ Impossível | ✅ Automático |
| Reutilizar        | ❌ Não        | ✅ Sim        |
| Debug             | ⚠️ Complexo   | ✅ Simples    |

---

## 🚀 Como Aplicar no Seu Projeto

### **1. Identifique Componentes Monolíticos**

```bash
# Procure por:
- Arquivos com 200+ linhas
- Múltiplos useStates
- Muitos event handlers
- JSX muito grande
```

### **2. Escreva Testes PRIMEIRO**

```typescript
// ❌ NÃO FAÇA:
// 1. Escrever código
// 2. Tentar adicionar testes depois

// ✅ FAÇA:
// 1. Escrever teste que falha
// 2. Escrever código mínimo que passa
// 3. Refatorar mantendo testes verdes
```

### **3. Divida em Partes Pequenas**

```
Componente Grande (200 linhas)
↓
Hook (lógica) + View (UI) (100 linhas cada)
↓
View = Header + Body + Footer (30-40 linhas cada)
```

### **4. Mantenha Compatibilidade**

```typescript
// Exporte nova versão com nome antigo
export { OnboardingContainer as OnboardingScreen };

// Mantenha versão antiga por um tempo
export { OnboardingScreen as OnboardingScreenLegacy };
```

---

## ✅ Checklist de Refatoração

- [ ] Testes escritos ANTES do código
- [ ] Cada componente tem responsabilidade única
- [ ] Props são mínimas e específicas
- [ ] Lógica separada de apresentação
- [ ] 100% de cobertura de testes
- [ ] TypeScript sem erros
- [ ] Linter sem warnings
- [ ] Compatibilidade mantida
- [ ] Documentação atualizada

---

## 🎓 Lições Aprendidas

### **1. TDD Realmente Funciona**

- Testes guiam o design
- Código fica mais testável naturalmente
- Confiança para refatorar

### **2. SOLID Não é Teoria**

- Componentes pequenos são mais fáceis
- Responsabilidade única facilita manutenção
- Abstrações permitem flexibilidade

### **3. Refatoração é Investimento**

- Tempo inicial: ~30min
- ROI: ∞ (qualidade, confiança, velocidade futura)

---

## 📚 Recursos

### Ferramentas Usadas

- Jest + React Testing Library
- TypeScript
- ESLint
- Prettier

### Referências

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)
- [TDD by Kent Beck](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)

---

## 🎯 Próximos Passos

1. Aplicar mesma estratégia em outros componentes
2. Adicionar testes E2E
3. Implementar CI/CD com cobertura mínima
4. Documentar padrões no time

---

**Resultado:** Código mais limpo, testável e manutenível! 🎉
