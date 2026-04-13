// gameLogic.js contém as funções responsáveis pelas regras do jogo Vocablo

// Compara a palavra tentada com a palavra secreta
// Retorna um array de 5 objetos com { letter, status } para cada posição
export function checkGuess(guess, answer) {
  const guessLetters = guess.toUpperCase().split('');
  const answerLetters = answer.toUpperCase().split('');

  // Inicializa o resultado com status 'absent' para todas as letras
  const result = guessLetters.map((letter) => ({ letter, status: 'absent' }));

  // Cópia do answer usada para controlar quais letras já foram contabilizadas,
  // evitando que a mesma letra do answer seja marcada duas vezes
  const remaining = [...answerLetters];

  // Primeira passagem: marca as letras na posição exata como 'correct'
  result.forEach((item, i) => {
    if (item.letter === answerLetters[i]) {
      item.status = 'correct';
      remaining[i] = null; // remove da lista para não ser contada novamente
    }
  });

  // Segunda passagem: para as letras ainda não marcadas como 'correct',
  // verifica se a letra existe em outra posição da palavra (status 'present')
  result.forEach((item, i) => {
    if (item.status === 'correct') return; // já resolvida na primeira passagem

    const index = remaining.indexOf(item.letter);
    if (index !== -1) {
      item.status = 'present';
      remaining[index] = null; // remove para evitar duplicatas
    }
    // se não encontrou, permanece 'absent'
  });

  return result;
}
