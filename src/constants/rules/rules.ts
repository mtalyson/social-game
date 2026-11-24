import type { IRuleItem } from '@/types/rules/interfaces/rules';

export const HOW_TO_PLAY_RULES: IRuleItem[] = [
  {
    emoji: '🎲',
    title: 'O Número Secreto',
    description:
      'No início de cada rodada, o celular sorteia um número secreto entre 1 e 60. Ninguém sabe qual é!',
  },
  {
    emoji: '👆',
    title: 'Sua Vez',
    description:
      'Na sua vez, escolha um número no grid. Se você acertar o número secreto... você bebe! 🍺',
  },
  {
    emoji: '🔽',
    title: 'Palpite Menor que o Secreto',
    description:
      'Se o número que você escolheu é menor que o secreto, todos os números iguais ou menores ao seu palpite são eliminados. O jogo continua!',
  },
  {
    emoji: '🔼',
    title: 'Palpite Maior que o Secreto',
    description:
      'Se o número que você escolheu é maior que o secreto, todos os números iguais ou maiores ao seu palpite são eliminados. O jogo continua!',
  },
  {
    emoji: '🎯',
    title: 'Caso Especial',
    description:
      'Quando sobram apenas dois números consecutivos e alguém escolhe o errado, o número secreto é revelado! Nesse caso, quem bebe não é quem jogou por último, mas sim quem iniciou a rodada.',
  },
  {
    emoji: '🔄',
    title: 'Próxima Rodada',
    description:
      'Quem perdeu (bebeu) começa a próxima rodada. Um novo número secreto é sorteado e todos os 60 números voltam a ficar disponíveis.',
  },
  {
    emoji: '🏆',
    title: 'Objetivo',
    description:
      'Sobreviva o máximo de rodadas sem beber! Vai com calma nos palpites e tenta empurrar a bomba para os outros. 😄',
  },
];
