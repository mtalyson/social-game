import type { IRuleItem } from '@/types/rules/interfaces/rules';

export const HOW_TO_PLAY_RULES: IRuleItem[] = [
  {
    icon: 'dice',
    title: 'O Sorteio',
    description:
      'No início de cada rodada, o celular sorteia um número entre 1 e 60. Ninguém sabe qual é!',
  },
  {
    icon: 'hand-left',
    title: 'Sua Vez',
    description: 'Na sua vez, escolha um número. Se você acertar... você bebe!',
  },
  {
    icon: 'refresh',
    title: 'Próxima Rodada',
    description:
      'Quem perdeu começa a próxima rodada. Um novo número é sorteado e todos os 60 números voltam a ficar disponíveis.',
  },
  {
    icon: 'trophy',
    title: 'Objetivo',
    description:
      'Sobreviva o máximo de rodadas sem beber, então boa sorte nesses palpites e tenta empurrar essa ressaca para os outros!',
  },
];
