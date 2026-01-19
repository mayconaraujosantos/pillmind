# Exemplo de uso dos novos componentes de Tooltip

## ValidationAlert - Melhorado

```tsx
import { ValidationAlert } from '@shared/components';

// Para erros de validação
<ValidationAlert
  visible={showValidation}
  message="Por favor, preencha todos os campos obrigatórios (*)"
  type="error"
  onDismiss={() => setShowValidation(false)}
/>

// Para avisos
<ValidationAlert
  visible={showWarning}
  message="Verifique se o email está correto"
  type="warning"
  onDismiss={() => setShowWarning(false)}
/>
```

## SuccessTooltip - Novo

```tsx
import { SuccessTooltip } from '@shared/components';

// Para sucesso no cadastro
<SuccessTooltip
  visible={showSuccess}
  title="Sign Up Completed!"
  message="Account has been created successfully!"
  onDismiss={() => setShowSuccess(false)}
  autoHide={true}
  duration={5000}
/>

// Para outras ações de sucesso
<SuccessTooltip
  visible={profileSaved}
  title="Profile Updated!"
  message="Your information has been saved."
  onDismiss={() => setProfileSaved(false)}
/>
```

## Características dos novos componentes:

### ValidationAlert

- ✅ Usa Safe Area para não ser cortado
- 🎨 Design flat moderno com cores sólidas
- 🔄 Auto-hide após 4 segundos
- 📍 Posicionamento relativo ao safe area top
- 🎯 Suporte para error, success, warning

### SuccessTooltip

- ✅ Similar ao exemplo da imagem mostrada
- 🎨 Design com borda verde e background sólido
- ⭐ Ícone de check bem visível
- 📝 Suporte para título + mensagem
- ⏰ Auto-hide configurável
- 🔄 Animações suaves de slide e fade
