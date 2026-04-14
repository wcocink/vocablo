import React from 'react';

// Layout QWERTY brasileiro — 3 linhas
const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

// Cores de fundo e texto por status da letra
const STATUS_STYLES = {
  correct: { backgroundColor: '#22C55E', color: '#ffffff' },
  present: { backgroundColor: '#EAB308', color: '#ffffff' },
  absent:  { backgroundColor: '#3F3F46', color: '#d4d4d8' },
};

/*
 * Key — tecla individual do teclado virtual.
 *
 * Props:
 * - label  : texto da tecla (letra, 'ENTER' ou '⌫')
 * - onKey  : callback chamado com o label ao clicar
 * - status : melhor status conhecido da letra
 */
function Key({ label, onKey, status }) {
  const isWide = label === 'ENTER' || label === '⌫';

  // Cor baseada no status; cinza escuro por padrão (tecla não usada)
  const { backgroundColor, color } = STATUS_STYLES[status] || {
    backgroundColor: '#27272A',
    color: '#FAFAFA',
  };

  return (
    <button
      onClick={() => onKey(label)}
      aria-label={label}
      aria-pressed={!!status}
      className="game-btn"
      style={{
        flex: isWide ? 1.5 : 1,
        minHeight: 48,
        borderRadius: 8,
        border: 'none',
        backgroundColor,
        color,
        fontFamily: 'sans-serif',
        fontWeight: 600,
        fontSize: 12,
        textTransform: 'uppercase',
        userSelect: 'none',
      }}
    >
      {label}
    </button>
  );
}

/*
 * Keyboard — teclado virtual completo com 3 linhas.
 *
 * Props:
 * - onKey         : callback chamado com a tecla pressionada
 * - letterStatuses: mapa { letra → melhor status } para colorir as teclas
 */
function Keyboard({ onKey = () => {}, letterStatuses = {} }) {
  return (
    <div
      role="group"
      aria-label="Teclado virtual"
      style={{
        width: '100%',
        maxWidth: 500,
        padding: '0 8px',
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        marginTop: 8,
      }}
    >
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
          {row.map((label) => (
            <Key
              key={label}
              label={label}
              onKey={onKey}
              status={letterStatuses[label]}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
