# 🍺 Jogo do Número

Um jogo de bar mobile do tipo "passa o celular" para jogar presencialmente com amigos. Feito com **React Native**, **Expo** e **TypeScript**.

## 🎮 Como funciona

1. O celular sorteia um número secreto entre 1 e 60
2. Cada jogador, na sua vez, escolhe um número no grid
3. Se acertar o número secreto — **bebe!** 🍺
4. Se errar, parte dos números é eliminada e o jogo continua
5. Quando restam apenas 2 números consecutivos e alguém revela o secreto por eliminação, quem iniciou a rodada bebe

## 🚀 Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v18 ou superior)
- [Expo Go](https://expo.dev/go) instalado no celular (Android ou iOS)

### Instalação

```bash
# Clone o repositório
git clone <repo-url>
cd drink-game

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

## 🧪 Testes

A lógica do jogo é coberta por **52 testes unitários** em Jest:

```bash
npm test
```

Os testes cobrem:
- Sorteio do número secreto nos limites (1 e 60)
- Escolha de números nos extremos (1 e 60)
- Desabilitar números corretamente acima/abaixo do secreto
- Números "pulados" no meio do range continuam disponíveis
- Caso especial de 2 números adjacentes restantes (ambos desfechos)
- Rejeição de números já desabilitados
- Rotação de jogadores e transição de rodadas

## 📁 Estrutura do projeto

```
drink-game/
├── src/
│   ├── app/                    # Telas (Expo Router)
│   │   ├── _layout.tsx         # Root layout (Stack Navigator + GameProvider)
│   │   ├── index.tsx           # HomeScreen
│   │   ├── setup.tsx           # SetupScreen (cadastro de jogadores)
│   │   ├── game.tsx            # GameScreen (grid de números)
│   │   ├── round-result.tsx    # RoundResultScreen (quem bebe)
│   │   └── how-to-play.tsx     # HowToPlayScreen (regras)
│   ├── components/             # Componentes reutilizáveis
│   │   ├── NumberCell.tsx      # Célula individual do grid
│   │   ├── NumberGrid.tsx      # Grid 6×10 de números
│   │   ├── PlayerTurnBanner.tsx # Banner "vez de..."
│   │   └── PrimaryButton.tsx   # Botão com gradiente
│   ├── game/                   # Lógica pura (zero React)
│   │   ├── types.ts            # Tipos (Player, GameState, etc.)
│   │   ├── gameRules.ts        # Funções de regra puras
│   │   ├── gameEngine.ts       # Processamento de jogadas
│   │   └── gameReducer.ts      # Reducer para useReducer
│   ├── hooks/
│   │   └── useGame.tsx         # Context + hook do jogo
│   └── theme/                  # Design tokens
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
├── __tests__/
│   └── game/
│       ├── gameRules.test.ts   # Testes das regras
│       └── gameEngine.test.ts  # Testes do engine
└── ...
```

## 🎨 Design

- **Tema escuro** otimizado para ambientes de bar (baixa luminosidade)
- Paleta âmbar/dourada sobre fundo escuro
- Botões grandes para facilitar uso em ambientes de bar
- Feedback tátil (haptics) ao interagir
- Animações sutis nas transições

## 📋 Stack técnica

- **Expo SDK 57** + **React Native 0.86**
- **Expo Router** (file-based navigation)
- **TypeScript** com tipagem estrita
- **useReducer** para gerenciamento de estado
- **Jest** + **ts-jest** para testes
- **expo-haptics** para feedback tátil
- **expo-linear-gradient** para gradientes

## 📝 Licença

MIT
