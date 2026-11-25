# 🍺 Perdeu, Bebeu!

Um jogo de bar mobile do tipo "passa o celular" para jogar presencialmente com amigos. Feito com **React Native**, **Expo** e **TypeScript**.

## 🎮 Como funciona

1. Cadastre de **2 a 12 jogadores** na tela de configuração
2. O celular sorteia um número entre **1 e 60**
3. Cada jogador, na sua vez, escolhe um número no grid
4. Se acertar o número — **bebe!**
5. Se errar, todos os números até o palpite (menores ou maiores, conforme a direção do sorteado) são eliminados e o jogo continua
6. Ao final da rodada, é possível iniciar a **Próxima Rodada** (com quem perdeu começando), **Mudar Jogadores** ou **Encerrar Jogo**

## 🚀 Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Expo Go](https://expo.dev/go) instalado no celular (Android ou iOS)

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd social-game

# Instale as dependências
npm install
```

### Rodando o app

```bash
# Inicia o servidor de desenvolvimento
npx expo start
```

Escaneie o QR code com o **Expo Go** (Android) ou com a câmera (iOS).

### Rodando em emulador

```bash
# Android
npx expo start --android

# iOS (apenas macOS)
npx expo start --ios
```

## 🧪 Testes e Qualidade

A lógica do jogo é coberta por **65 testes unitários** em Jest (3 suítes colocalizadas em `src/domain/`):

```bash
# Testes unitários
npm test

# Verificação de tipos (incluindo arquivos de teste)
npx tsc --noEmit

# Lint e formatação
npm run lint
npm run format:check
```

Scripts disponíveis no `package.json`:

- `npm run lint` / `npm run lint:fix` — verificação e correção com ESLint
- `npm run format` / `npm run format:check` — formatação com Prettier

## 📁 Estrutura do projeto

```text
social-game/
├── public/
│   └── assets/                         # Ícones, splash screen e favicon
├── src/
│   ├── app/                            # Rotas e layouts (Expo Router, apenas re-exportam screens)
│   │   ├── _layout.tsx                 # Root layout (Stack Navigator + GameProvider)
│   │   ├── (home)/index.tsx
│   │   ├── (game)/
│   │   │   ├── setup.tsx
│   │   │   ├── game.tsx
│   │   │   └── round-result.tsx
│   │   └── (info)/how-to-play.tsx
│   ├── screens/                        # Telas e estilos separados por contexto
│   │   ├── home/
│   │   │   ├── homeScreen.tsx
│   │   │   └── styles.ts
│   │   ├── setup/
│   │   │   ├── setupScreen.tsx
│   │   │   └── styles.ts
│   │   ├── game/
│   │   │   ├── gameScreen.tsx
│   │   │   └── styles.ts
│   │   ├── roundResult/
│   │   │   ├── roundResultScreen.tsx
│   │   │   └── styles.ts
│   │   └── howToPlay/
│   │       ├── howToPlayScreen.tsx
│   │       └── styles.ts
│   ├── components/
│   │   ├── ui/
│   │   │   └── primaryButton.tsx       # Botão reutilizável com gradiente e ícone
│   │   └── game/                       # Componentes específicos do jogo
│   │       ├── confirmGuessModal.tsx
│   │       ├── numberCell.tsx
│   │       ├── numberGrid.tsx
│   │       └── playerTurnBanner.tsx
│   ├── contexts/
│   │   └── gameContext.tsx             # GameContext + GameProvider
│   ├── hooks/
│   │   └── useGame.ts                  # Hook useGame
│   ├── domain/                         # Domínio puro + testes colocalizados
│   │   ├── gameEngine/
│   │   │   ├── gameEngine.ts
│   │   │   └── gameEngine.test.ts
│   │   ├── gameReducer/
│   │   │   ├── gameReducer.ts
│   │   │   └── gameReducer.test.ts
│   │   └── gameRules/
│   │       ├── gameRules.ts
│   │       └── gameRules.test.ts
│   ├── constants/                      # Constantes separadas por contexto
│   │   ├── game/
│   │   │   └── game.ts                 # Limites e configuração do grid
│   │   └── rules/
│   │       └── rules.ts                # Conteúdo dos cards de regras
│   ├── theme/                          # Design tokens
│   │   ├── colors.ts
│   │   ├── typography.ts
│   │   └── spacing.ts
│   └── types/                          # Enums (E*), Interfaces (I*) e Types (T*) por contexto
│       ├── game/
│       │   ├── enums/game.ts
│       │   └── interfaces/
│       │       ├── game.ts
│       │       └── gameContexts.ts
│       ├── rules/
│       │   └── interfaces/rules.ts
│       └── ui/
│           ├── enums/ui.ts
│           └── interfaces/ui.ts
├── eslint.config.mjs
├── jest.config.js
├── tsconfig.json
└── .prettierrc
```

## 🎨 Design

- **Tema escuro** otimizado para ambientes de bar (baixa luminosidade)
- Paleta âmbar/dourada sobre fundo escuro
- Grid responsivo (`useWindowDimensions`) que adapta os 60 números à largura e altura da tela
- Ícones vetoriais com `@expo/vector-icons` (`Ionicons`)
- Feedback tátil (`expo-haptics`) ao interagir
- Animações sutis nas transições

## 📋 Stack técnica

- **Expo SDK 58** + **React Native 0.88** + **React 19.3**
- **Expo Router** (file-based navigation com Route Groups)
- **TypeScript** com tipagem estrita e união discriminada para o estado do jogo
- **useReducer** + Context API para gerenciamento de estado
- **@expo/vector-icons** (`Ionicons`)
- **ESLint 9** + **Prettier**
- **Jest** + **ts-jest** para testes unitários
- **expo-haptics** para feedback tátil
- **expo-linear-gradient** para gradientes
