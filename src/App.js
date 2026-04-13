// App.js é o componente principal da aplicação
// Ele é o ponto de entrada de toda a interface do Vocablo

import React, { useState } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import { checkGuess } from './logic/gameLogic';

// Palavra secreta fixa por enquanto
const SECRET = 'CARRO';

function App() {
  // Letras digitadas na tentativa atual (ainda não submetida)
  const [currentGuess, setCurrentGuess] = useState('');

  // Lista de palavras já submetidas pelo jogador
  const [guesses, setGuesses] = useState([]);

  // Lista de resultados do checkGuess, um por tentativa submetida
  // Cada item é um array de 5 objetos { letter, status }
  const [results, setResults] = useState([]);

  // Lida com cada tecla pressionada no teclado virtual
  function handleKey(key) {
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

      // Salva a tentativa e seu resultado, e limpa o campo atual
      setGuesses((prev) => [...prev, currentGuess]);
      setResults((prev) => [...prev, result]);
      setCurrentGuess('');
      return;
    }

    // Adiciona a letra à tentativa atual (máximo de 5 letras)
    if (currentGuess.length < 5) {
      setCurrentGuess((prev) => prev + key);
    }
  }

  // Monta o array de palavras exibido no Grid:
  // tentativas já submetidas + tentativa atual em andamento
  const allGuesses = [...guesses, currentGuess];

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
      <Keyboard onKey={handleKey} />
    </div>
  );
}

// Exporta o componente para ser usado no index.js
export default App;
