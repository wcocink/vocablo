// App.js é o componente principal da aplicação
// Ele é o ponto de entrada de toda a interface do Vocablo

import React, { useState } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import { checkGuess } from './logic/gameLogic';
// Importa o objeto WORDS que contém as listas de palavras por idioma
import { WORDS } from './data/words';

// Sorteia uma palavra aleatória de um array de palavras.
function pickRandomWord(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// Número máximo de tentativas permitidas
const MAX_GUESSES = 6;

// Metadados dos idiomas disponíveis: chave usada em WORDS e rótulo exibido no botão
const LANGUAGES = [
  { key: 'pt', label: 'Português' },
  { key: 'nl', label: 'Nederlands' },
];

function App() {
  // Idioma atual do jogo; começa em português
  const [language, setLanguage] = useState('pt');

  // Palavra secreta sorteada para a partida atual.
  // Inicializada com uma palavra de WORDS.pt; atualizada ao trocar de idioma.
  const [secret, setSecret] = useState(() => pickRandomWord(WORDS.pt));

  // Letras digitadas na tentativa atual (ainda não submetida)
  const [currentGuess, setCurrentGuess] = useState('');

  // Lista de palavras já submetidas pelo jogador
  const [guesses, setGuesses] = useState([]);

  // Lista de resultados do checkGuess, um por tentativa submetida
  // Cada item é um array de 5 objetos { letter, status }
  const [results, setResults] = useState([]);

  // Estado do jogo: null = em andamento | 'won' = vitória | 'lost' = derrota
  const [gameStatus, setGameStatus] = useState(null);

  // Troca o idioma e reinicia o jogo completamente:
  // sorteia nova palavra do idioma selecionado e limpa todos os estados da partida.
  function handleLanguageChange(lang) {
    if (lang === language) return; // clicou no idioma já ativo, não faz nada
    setLanguage(lang);
    setSecret(pickRandomWord(WORDS[lang]));
    setCurrentGuess('');
    setGuesses([]);
    setResults([]);
    setGameStatus(null);
  }

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

      // Avalia a tentativa contra a palavra secreta sorteada
      const result = checkGuess(currentGuess, secret);
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

      {/* Seletor de idioma: um botão por idioma disponível em LANGUAGES.
          O botão do idioma ativo recebe fundo escuro e texto branco;
          os inativos ficam com fundo transparente e borda visível. */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {LANGUAGES.map(({ key, label }) => {
          const isActive = key === language;
          return (
            <button
              key={key}
              onClick={() => handleLanguageChange(key)}
              style={{
                padding: '6px 16px',
                borderRadius: 6,
                border: '2px solid #555',
                cursor: isActive ? 'default' : 'pointer',
                fontWeight: isActive ? 'bold' : 'normal',
                backgroundColor: isActive ? '#555' : 'transparent',
                color: isActive ? '#fff' : '#555',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

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
          A palavra era: {secret}
        </p>
      )}

      {/* O teclado continua visível, mas handleKey bloqueia o input quando gameStatus !== null */}
      <Keyboard onKey={handleKey} />
    </div>
  );
}

// Exporta o componente para ser usado no index.js
export default App;
