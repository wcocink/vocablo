import React, { useState, useEffect, useCallback } from 'react';
import Grid from './components/Grid';
import Keyboard from './components/Keyboard';
import { checkGuess } from './logic/gameLogic';
import { WORDS } from './data/words';

/*
 * getDailyWord — escolhe deterministicamente a palavra do dia.
 *
 * A lógica:
 * 1. Converte a data atual em um número inteiro: YYYYMMDD (ex: 20260415).
 *    Isso garante que o seed muda exatamente uma vez por dia.
 * 2. Calcula um hash simples do código do idioma somando os char codes
 *    de cada caractere (ex: "pt" → 112 + 116 = 228).
 *    Isso faz com que idiomas diferentes produzam palavras diferentes
 *    para a mesma data, sem precisar de listas separadas de índices.
 * 3. Soma dateSeed + langHash e aplica módulo pelo tamanho da lista
 *    para obter um índice sempre válido e repetível.
 */
function getDailyWord(wordList, language) {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth() + 1; // getMonth() retorna 0–11
  const day   = now.getDate();

  // Seed numérico baseado na data (ex: 20260415)
  const dateSeed = year * 10000 + month * 100 + day;

  // Influência do idioma: soma dos char codes (ex: "pt" → 228, "nl" → 220)
  const langHash = language.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);

  // Índice determinístico: mesmo dia + idioma → sempre a mesma palavra
  const index = (dateSeed + langHash) % wordList.length;

  return wordList[index];
}

const MAX_GUESSES = 6;
const EMPTY_GUESS  = ['', '', '', '', ''];

const LANGUAGES = [
  { key: 'pt', label: 'Português' },
  { key: 'nl', label: 'Nederlands' },
];

const STATUS_PRIORITY = { correct: 2, present: 1, absent: 0 };

function App() {
  const [language,     setLanguage]     = useState('pt');
  const [secret,       setSecret]       = useState(() => getDailyWord(WORDS.pt, 'pt'));
  const [currentGuess, setCurrentGuess] = useState([...EMPTY_GUESS]);
  const [selectedCol,  setSelectedCol]  = useState(0);
  const [guesses,      setGuesses]      = useState([]);
  const [results,      setResults]      = useState([]);
  const [gameStatus,   setGameStatus]   = useState(null);
  const [shakeRow,     setShakeRow]     = useState(null);
  const [copied,       setCopied]       = useState(false);

  function handleLanguageChange(lang) {
    if (lang === language) return;
    setLanguage(lang);
    setSecret(getDailyWord(WORDS[lang], lang));
    setCurrentGuess([...EMPTY_GUESS]);
    setSelectedCol(0);
    setGuesses([]);
    setResults([]);
    setGameStatus(null);
    setShakeRow(null);
  }

  function resetGame() {
    setSecret(getDailyWord(WORDS[language], language));
    setCurrentGuess([...EMPTY_GUESS]);
    setSelectedCol(0);
    setGuesses([]);
    setResults([]);
    setGameStatus(null);
    setShakeRow(null);
  }

  /*
   * handleShare — gera o texto de compartilhamento e copia para o clipboard.
   *
   * Formato:
   *   VOCABLO 15/04/2026
   *   3/6            ← número de tentativas (ou X/6 se perdeu)
   *
   *   🟩🟨⬛⬛⬛    ← uma linha de emojis por tentativa submetida
   *   ...
   *
   * Mapeamento de status → emoji:
   *   correct → 🟩 | present → 🟨 | absent → ⬛
   *
   * Após copiar, exibe "Copiado!" por 2 segundos via estado `copied`.
   */
  function handleShare() {
    const now     = new Date();
    const day     = String(now.getDate()).padStart(2, '0');
    const month   = String(now.getMonth() + 1).padStart(2, '0');
    const year    = now.getFullYear();
    const dateStr = `${day}/${month}/${year}`;

    const EMOJI = { correct: '🟩', present: '🟨', absent: '⬛' };

    // Converte cada resultado em uma linha de emojis
    const emojiGrid = results
      .map(row => row.map(({ status }) => EMOJI[status]).join(''))
      .join('\n');

    // "X/6" se perdeu, "n/6" se ganhou
    const attempts = gameStatus === 'lost' ? 'X' : guesses.length;

    const text = `VOCABLO ${dateStr}\n${attempts}/6\n\n${emojiGrid}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const handleKey = useCallback(function (key) {
    if (gameStatus !== null) return;

    if (key === '⌫') {
      setCurrentGuess(prev => {
        const next = [...prev];
        if (next[selectedCol] !== '') {
          // Limpa a célula focada
          next[selectedCol] = '';
        } else if (selectedCol > 0) {
          // Célula já vazia: recua e limpa a anterior
          next[selectedCol - 1] = '';
          setSelectedCol(s => s - 1);
        }
        return next;
      });
      return;
    }

    if (key === 'ENTER') {
      // Rejeita se alguma célula ainda estiver vazia
      if (!currentGuess.every(c => c !== '')) {
        const row = guesses.length;
        setShakeRow(row);
        setTimeout(() => setShakeRow(null), 600);
        return;
      }

      const word = currentGuess.join('');

      /*
       * Validação de dicionário: verifica se a palavra existe em WORDS[language].
       * A busca usa o idioma atual, então funciona para qualquer idioma presente
       * em WORDS (pt, nl, etc.) sem nenhuma adaptação extra.
       * Se a palavra não for encontrada, agita a linha e interrompe a submissão.
       */
      if (!WORDS[language].includes(word)) {
        setShakeRow(guesses.length);
        setTimeout(() => setShakeRow(null), 600);
        return;
      }
      const result  = checkGuess(word, secret);
      const newGuesses = [...guesses, word];
      const newResults = [...results, result];

      setGuesses(newGuesses);
      setResults(newResults);
      setCurrentGuess([...EMPTY_GUESS]);
      setSelectedCol(0);

      if (result.every(item => item.status === 'correct')) {
        setGameStatus('won');
        return;
      }

      if (newGuesses.length >= MAX_GUESSES) {
        setGameStatus('lost');
      }

      return;
    }

    // Letra: preenche a célula focada e avança o cursor
    setCurrentGuess(prev => {
      const next = [...prev];
      next[selectedCol] = key;
      return next;
    });
    if (selectedCol < 4) setSelectedCol(s => s + 1);
  }, [currentGuess, selectedCol, guesses, results, gameStatus, secret]);

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

  // Para o Grid: linha atual como array (funciona com word[colIndex])
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

            {/* Botão de compartilhar: mesmo shape do "Jogar novamente", cor neutra */}
            <button
              onClick={handleShare}
              className="game-btn"
              style={{
                width: '100%',
                backgroundColor: '#3F3F46',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: 16,
                padding: '12px 24px',
                borderRadius: 12,
                border: 'none',
                marginTop: 8,
              }}
            >
              {copied ? 'Copiado!' : 'Compartilhar'}
            </button>
          </div>
        </div>
      )}

      {/* ── Título ── */}
      <h1 style={{
        fontSize: 42,
        fontWeight: 700,
        fontFamily: 'sans-serif',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: '#7C3AED',
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
      <Grid
        guesses={allGuesses}
        results={results}
        shakeRow={shakeRow}
        selectedCol={gameStatus === null ? selectedCol : null}
        onCellClick={gameStatus === null ? setSelectedCol : undefined}
      />

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

          {/* Botão de compartilhar na derrota */}
          <button
            onClick={handleShare}
            className="game-btn"
            style={{
              backgroundColor: '#3F3F46',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: 15,
              padding: '10px 32px',
              borderRadius: 12,
              border: 'none',
            }}
          >
            {copied ? 'Copiado!' : 'Compartilhar'}
          </button>
        </div>
      )}

      {/* ── Teclado virtual ── */}
      <Keyboard onKey={handleKey} letterStatuses={letterStatuses} />
    </div>
  );
}

export default App;
