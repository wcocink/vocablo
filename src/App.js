// App.js é o componente principal da aplicação
// Ele é o ponto de entrada de toda a interface do Vocablo

import React, { useState, useEffect, useCallback } from 'react';
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

  // Reinicia o jogo mantendo o idioma atual:
  // sorteia uma nova palavra e limpa todos os estados da partida.
  function resetGame() {
    setSecret(pickRandomWord(WORDS[language]));
    setCurrentGuess('');
    setGuesses([]);
    setResults([]);
    setGameStatus(null);
  }

  // Lida com cada tecla pressionada no teclado virtual ou físico.
  // Envolto em useCallback para que a referência só mude quando um dos estados
  // listados em dependências mudar — necessário para o useEffect do teclado físico
  // não reregistrar o listener a cada render.
  const handleKey = useCallback(function (key) {
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
  }, [currentGuess, guesses, results, gameStatus, secret]);

  // Conecta o teclado físico ao handleKey existente.
  // useEffect registra o listener ao montar o componente e o remove ao desmontar,
  // evitando vazamentos de memória. A dependência [handleKey] garante que o listener
  // sempre use a versão mais recente da função (que fecha sobre os estados atuais).
  useEffect(() => {
    function onKeyDown(e) {
      // Ignora teclas com modificadores (Ctrl, Alt, Meta) para não capturar
      // atalhos do navegador como Ctrl+R ou Alt+F4.
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      if (e.key === 'Enter') {
        handleKey('ENTER');
      } else if (e.key === 'Backspace') {
        handleKey('⌫');
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        // Normaliza para maiúsculo, igual ao teclado virtual
        handleKey(e.key.toUpperCase());
      }
    }

    document.addEventListener('keydown', onKeyDown);

    // Função de limpeza: remove o listener quando o componente for desmontado
    // ou antes de registrar um novo listener no próximo render.
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  // Monta o array de palavras exibido no Grid:
  // tentativas já submetidas + tentativa atual em andamento (omitida se o jogo acabou)
  const allGuesses = gameStatus !== null ? guesses : [...guesses, currentGuess];

  // Constrói um mapa { letra → melhor status } a partir de todos os resultados submetidos.
  // A prioridade é correct > present > absent: se uma letra já apareceu como "correct",
  // esse status nunca é rebaixado por um "present" ou "absent" de outra tentativa.
  const STATUS_PRIORITY = { correct: 2, present: 1, absent: 0 };
  const letterStatuses = results.reduce((acc, result) => {
    result.forEach(({ letter, status }) => {
      const current = acc[letter];
      // Atualiza apenas se o novo status tiver prioridade maior que o registrado
      if (current === undefined || STATUS_PRIORITY[status] > STATUS_PRIORITY[current]) {
        acc[letter] = status;
      }
    });
    return acc;
  }, {});

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minHeight: '100vh',
      paddingTop: 40,
    }}>
      <h1 style={{
        fontFamily: 'sans-serif',
        fontSize: 42,
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#5048e5',
        margin: '0 0 20px',
      }}>
        Vocablo
      </h1>

      {/* Seletor de idioma: ativo em roxo escuro (#5048e5), inativo em roxo claro (#ede9fe) */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {LANGUAGES.map(({ key, label }) => {
          const isActive = key === language;
          return (
            <button
              key={key}
              onClick={() => handleLanguageChange(key)}
              style={{
                padding: '6px 18px',
                borderRadius: 20,
                border: 'none',
                cursor: isActive ? 'default' : 'pointer',
                fontWeight: 'bold',
                backgroundColor: isActive ? '#5048e5' : '#ede9fe',
                color: isActive ? '#fff' : '#5048e5',
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

      {/* Botão "Jogar novamente" exibido apenas ao fim do jogo (vitória ou derrota).
          Ao clicar, chama resetGame: sorteia nova palavra do idioma atual
          e limpa tentativas, resultados e status. */}
      {gameStatus !== null && (
        <button
          onClick={resetGame}
          style={{
            marginTop: 12,
            padding: '8px 20px',
            borderRadius: 6,
            border: 'none',
            backgroundColor: '#5048e5',
            color: '#fff',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          Jogar novamente
        </button>
      )}

      {/* Passa letterStatuses para o Keyboard colorir cada tecla conforme o melhor status conhecido */}
      <Keyboard onKey={handleKey} letterStatuses={letterStatuses} />
    </div>
  );
}

// Exporta o componente para ser usado no index.js
export default App;
