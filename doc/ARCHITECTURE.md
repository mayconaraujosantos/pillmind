# Arquitetura do PillMind

## Visão Geral

O PillMind utiliza uma **arquitetura Feature-Based com princípios de Clean Architecture**, organizando o código em features independentes e módulos compartilhados.

## Estrutura de Pastas

```
src/
├── core/                    # Configurações centrais da aplicação
│   ├── config/              # Configurações (API, app, etc.)
│   └── navigation/          # Configuração de navegação
│
├── features/                # Features do aplicativo
│   ├── home/                # Feature Home (Medicamentos)
│   │   ├── domain/          # Camada de domínio
│   │   │   ├── entities/    # Entidades de negócio
│   │   │   ├── repositories/ # Interfaces de repositórios
│   │   │   └── useCases/    # Casos de uso
│   │   ├── data/            # Camada de dados
│   │   │   ├── repositories/ # Implementação dos repositórios
│   │   │   └── datasources/ # Fontes de dados (API, Local DB)
│   │   └── presentation/    # Camada de apresentação
│   │       ├── screens/     # Telas
│   │       ├── components/  # Componentes específicos da feature
│   │       └── hooks/       # Hooks customizados
│   │
│   ├── appointments/        # Feature Appointments
│   ├── account/             # Feature Account
│   ├── parental/            # Feature Parental
│   └── nearby/              # Feature Nearby
│
└── shared/                  # Módulos compartilhados
    ├── components/          # Componentes reutilizáveis
    ├── constants/           # Constantes
    ├── types/               # Tipos TypeScript compartilhados
    └── utils/               # Funções utilitárias
```

## Camadas da Arquitetura

### 1. Domain (Domínio)

- **Responsabilidade**: Lógica de negócio pura, independente de frameworks
- **Contém**:
  - **Entities**: Modelos de dados do domínio
  - **Repositories**: Interfaces que definem contratos de acesso a dados
  - **Use Cases**: Regras de negócio e lógica de aplicação

### 2. Data (Dados)

- **Responsabilidade**: Implementação de acesso a dados
- **Contém**:
  - **Repositories**: Implementação concreta dos repositórios
  - **DataSources**: Fontes de dados (API REST, banco local, etc.)
  - **DTOs**: Data Transfer Objects para comunicação com APIs

### 3. Presentation (Apresentação)

- **Responsabilidade**: Interface do usuário e interação
- **Contém**:
  - **Screens**: Telas da aplicação
  - **Components**: Componentes React específicos da feature
  - **Hooks**: Hooks customizados para lógica de UI

## Princípios

### 1. Separação de Responsabilidades

Cada camada tem uma responsabilidade única e bem definida:

- **Domain**: Regras de negócio
- **Data**: Acesso a dados
- **Presentation**: Interface do usuário

### 2. Inversão de Dependências

As camadas internas (Domain) não dependem das externas (Data, Presentation). As dependências apontam para dentro.

### 3. Features Independentes

Cada feature é auto-contida e pode ser desenvolvida, testada e mantida independentemente.

### 4. Reutilização através de Shared

Componentes, utilitários e tipos compartilhados ficam no módulo `shared`.

## Fluxo de Dados

```
Presentation (Screen/Component)
    ↓ (chama)
Use Case
    ↓ (usa)
Repository Interface
    ↓ (implementado por)
Repository Implementation
    ↓ (usa)
DataSource (API/Local DB)
```

## Exemplo: Feature Home

### Domain

```typescript
// entities/Medicine.ts
export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  // ...
}

// repositories/MedicineRepository.ts
export interface MedicineRepository {
  getAll(): Promise<Medicine[]>;
  create(medicine: Omit<Medicine, 'id'>): Promise<Medicine>;
  // ...
}

// useCases/GetMedicinesUseCase.ts
export class GetMedicinesUseCase {
  constructor(private repository: MedicineRepository) {}
  async execute(): Promise<Medicine[]> {
    return this.repository.getAll();
  }
}
```

### Data

```typescript
// repositories/MedicineRepositoryImpl.ts
export class MedicineRepositoryImpl implements MedicineRepository {
  constructor(private dataSource: MedicineDataSource) {}

  async getAll(): Promise<Medicine[]> {
    return this.dataSource.getAll();
  }
}
```

### Presentation

```typescript
// screens/HomeScreen.tsx
export const HomeScreen = () => {
  const { medicines, loading } = useMedicines();
  // ...
};
```

## Navegação

A navegação é centralizada em `src/core/navigation/` usando React Navigation.

## Configuração

Configurações globais ficam em `src/core/config/`.

## Próximos Passos

1. Implementar camada de dados (API, Local Storage)
2. Adicionar gerenciamento de estado (Context API, Zustand, ou Redux)
3. Implementar testes unitários para Use Cases
4. Adicionar tratamento de erros global
5. Implementar autenticação
