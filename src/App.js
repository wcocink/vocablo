import React, { useState, useEffect, useCallback } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import { checkGuess } from './logic/gameLogic';
import { WORDS } from './data/words';

function pickRandomWord(list) {
  return list[Math.floor(Math.random() * list.length)];
}

const MAX_GUESSES = 6;

const LANGUAGES = [
  { key: 'pt', label: 'Português' },
  { key: 'nl', label: 'Nederlands' },
];

const STATUS_PRIORITY = { correct: 2, present: 1, absent: 0 };

function App() {
  const [language,     setLanguage]     = useState('pt');
  const [secret,       setSecret]       = useState(() => pickRandomWord(WORDS.pt));
  const [currentGuess, setCurrentGuess] = useState('');
  const [guesses,      setGuesses]      = useState([]);
  const [results,      setResults]      = useState([]);
  const [gameStatus,   setGameStatus]   = useState(null);

  // Índice da linha que deve agitar quando o jogador tenta submeter com < 5 letras
  const [shakeRow, setShakeRow] = useState(null);

  function handleLanguageChange(lang) {
    if (lang === language) return;
    setLanguage(lang);
    setSecret(pickRandomWord(WORDS[lang]));
    setCurrentGuess('');
    setGuesses([]);
    setResults([]);
    setGameStatus(null);
    setShakeRow(null);
  }

  function resetGame() {
    setSecret(pickRandomWord(WORDS[language]));
    setCurrentGuess('');
    setGuesses([]);
    setResults([]);
    setGameStatus(null);
    setShakeRow(null);
  }

  const handleKey = useCallback(function (key) {
    if (gameStatus !== null) return;

    if (key === '⌫') {
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    if (key === 'ENTER') {
      if (currentGuess.length !== 5) {
        // Anima a linha atual com shake para indicar tentativa inválida
        const row = guesses.length;
        setShakeRow(row);
        setTimeout(() => setShakeRow(null), 600);
        return;
      }

      const result = checkGuess(currentGuess, secret);
      const newGuesses = [...guesses, currentGuess];
      const newResults = [...results, result];

      setGuesses(newGuesses);
      setResults(newResults);
      setCurrentGuess('');

      if (result.every(item => item.status === 'correct')) {
        setGameStatus('won');
        return;
      }

      if (newGuesses.length >= MAX_GUESSES) {
        setGameStatus('lost');
      }

      return;
    }

    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess, guesses, results, gameStatus, secret]);

  useEffect(() => {
    function onKeyDown(e) {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      if (e.key === 'Enter')              handleKey('ENTER');
      else if (e.key === 'Backspace')     handleKey('⌫');
      else if (/^[a-zA-Z]$/.test(e.key)) handleKey(e.key.toUpperCase());
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  const allGuesses = gameStatus !== null ? guesses : [...guesses, currentGuess];

  // Mapa { letra → melhor status } para colorir as teclas do teclado
  const letterStatuses = results.reduce((acc, result) => {
    result.forEach(({ letter, status }) => {
      const current = acc[letter];
      if (current === undefined || STATUS_PRIORITY[status] > STATUS_PRIORITY[current]) {
        acc[letter] = status;
      }
    });
    return acc;
  }, {});

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0A0B',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 12px',
      gap: 12,
    }}>

      {/* ── Modal de vitória ── */}
      {gameStatus === 'won' && (
        <div
          className="animate-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-label="Você ganhou!"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            backgroundColor: 'rgba(0,0,0,0.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            className="animate-modal-card"
            style={{
              backgroundColor: '#18181B',
              border: '1px solid #27272a',
              borderRadius: 16,
              padding: 32,
              textAlign: 'center',
              maxWidth: 320,
              width: '100%',
              margin: '0 16px',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }} aria-hidden="true">🎉</div>
            <h2 style={{ color: '#ffffff', fontSize: 24, fontWeight: 700, margin: '0 0 4px' }}>
              Você acertou!
            </h2>
            <p style={{ color: '#a1a1aa', fontSize: 14, margin: '0 0 24px' }}>
              em {guesses.length} tentativa{guesses.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={resetGame}
              className="game-btn"
              style={{
                width: '100%',
                backgroundColor: '#22C55E',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 16,
                padding: '12px 24px',
                borderRadius: 12,
                border: 'none',
              }}
            >
              Jogar novamente
            </button>
          </div>
        </div>
      )}

      {/* ── Título ── */}
      <h1 style={{
        fontSize: 42,
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#ffffff',
        margin: 0,
      }}>
        VOCABLO
      </h1>

      {/* ── Divisor ── */}
      <div aria-hidden="true" style={{
        width: '100%',
        maxWidth: 320,
        height: 1,
        backgroundColor: '#27272a',
      }} />

      {/* ── Seletor de idioma ── */}
      <div style={{ display: 'flex', gap: 8 }} role="group" aria-label="Selecionar idioma">
        {LANGUAGES.map(({ key, label }) => {
          const isActive = key === language;
          return (
            <button
              key={key}
              onClick={() => handleLanguageChange(key)}
              aria-pressed={isActive}
              className={isActive ? undefined : 'lang-btn-inactive'}
              style={{
                padding: '6px 16px',
                borderRadius: 9999,
                fontSize: 14,
                fontWeight: 600,
                border: isActive ? 'none' : '1px solid #3f3f46',
                backgroundColor: isActive ? '#ffffff' : 'transparent',
                color: isActive ? '#18181b' : '#a1a1aa',
                cursor: isActive ? 'default' : 'pointer',
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── Grade ── */}
      <Grid guesses={allGuesses} results={results} shakeRow={shakeRow} />

      {/* ── Mensagem de derrota ── */}
      {gameStatus === 'lost' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <p style={{ color: '#ef4444', fontWeight: 600, fontSize: 14, margin: 0, textAlign: 'center' }}>
            A palavra era:{' '}
            <span style={{ color: '#ffffff', fontWeight: 700, letterSpacing: '0.15em' }}>
              {secret}
            </span>
          </p>
          <button
            onClick={resetGame}
            className="game-btn"
            style={{
              backgroundColor: '#22C55E',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 15,
              padding: '10px 32px',
              borderRadius: 12,
              border: 'none',
            }}
          >
            Jogar novamente
          </button>
        </div>
      )}

      {/* ── Teclado virtual ── */}
      <Keyboard onKey={handleKey} letterStatuses={letterStatuses} />
    </div>
  );
}

export default App;
