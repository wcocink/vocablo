// App.js é o componente principal da aplicação
// Ele é o ponto de entrada de toda a interface do Vocablo

import React, { useState } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import { checkGuess } from './logic/gameLogic';
// Importa o objeto WORDS que contém as listas de palavras por idioma
import { WORDS } from './data/words';

// Sorteia uma palavra aleatória do array de palavras em português.
// Math.random() gera um número entre 0 e 1; multiplicado pelo tamanho
// do array e truncado com Math.floor, produz um índice válido.
function pickRandomWord(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Palavra secreta sorteada uma vez ao carregar o módulo,
// substituindo o valor fixo anterior ('CARRO').
const SECRET = pickRandomWord(WORDS.pt);

// Número máximo de tentativas permitidas
const MAX_GUESSES = 6;

function App() {
  // Letras digitadas na tentativa atual (ainda não submetida)
  const [currentGuess, setCurrentGuess] = useState('');

  // Lista de palavras já submetidas pelo jogador
  const [guesses, setGuesses] = useState([]);

  // Lista de resultados do checkGuess, um por tentativa submetida
  // Cada item é um array de 5 objetos { letter, status }
  const [results, setResults] = useState([]);

  // Estado do jogo: null = em andamento | 'won' = vitória | 'lost' = derrota
  const [gameStatus, setGameStatus] = useState(null);

  // Lida com cada tecla pressionada no teclado virtual
  function handleKey(key) {
    // Bloqueia qualquer input quando o jogo já terminou (vitória ou derrota)
    if (gameStatus !== null) return;

    if (key === '⌫') {
      // Remove a última letra da tentativa atual
      setCurrentGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (key === 'ENTER') {
      // Só submete se a palavra tiver exatamente 5 letras
      if (currentGuess.length !== 5) return;

      // Avalia a tentativa e exibe o resultado no console
      const result = checkGuess(currentGuess, SECRET);
      console.log(result);

      const newGuesses = [...guesses, currentGuess];
      const newResults = [...results, result];

      // Salva a tentativa e seu resultado, e limpa o campo atual
      setGuesses(newGuesses);
      setResults(newResults);
      setCurrentGuess('');

      // Verifica vitória: todas as letras estão na posição correta
      const isCorrect = result.every((item) => item.status === 'correct');
      if (isCorrect) {
        setGameStatus('won');
        return;
      }

      // Verifica derrota: esgotou o número máximo de tentativas
      if (newGuesses.length >= MAX_GUESSES) {
        setGameStatus('lost');
      }

      return;
    }

    // Adiciona a letra à tentativa atual (máximo de 5 letras)
    if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key);
    }
  }

  // Monta o array de palavras exibido no Grid:
  // tentativas já submetidas + tentativa atual em andamento (omitida se o jogo acabou)
  const allGuesses = gameStatus !== null ? guesses : [...guesses, currentGuess];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      paddingTop: 40,
    }}>
      <h1>Vocablo</h1>
      {/* Passa as tentativas e os resultados para o Grid colorir as células */}
      <Grid guesses={allGuesses} results={results} />

      {/* Mensagem de vitória exibida quando o jogador acerta a palavra */}
      {gameStatus === 'won' && (
        <p style={{ fontSize: 20, fontWeight: 'bold', color: '#538d4e', marginTop: 16 }}>
          Você acertou!
        </p>
      )}

      {/* Mensagem de derrota exibida quando o jogador esgota as tentativas */}
      {gameStatus === 'lost' && (
        <p style={{ fontSize: 20, fontWeight: 'bold', color: '#b59f3b', marginTop: 16 }}>
          A palavra era: {SECRET}
        </p>
      )}

      {/* O teclado continua visível, mas handleKey bloqueia o input quando gameStatus !== null */}
      <Keyboard onKey={handleKey} />
    </div>
  );
}

// Exporta o componente para ser usado no index.js
export default App;
