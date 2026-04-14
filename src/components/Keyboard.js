import React from 'react';

// Layout do teclado dividido em 3 linhas, seguindo o padrão QWERTY em português
const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

// Mapeia cada status para as cores de fundo e texto da tecla correspondente
const STATUS_STYLES = {
  correct: { backgroundColor: '#538d4e', color: '#ffffff' },
  present: { backgroundColor: '#b59f3b', color: '#ffffff' },
  absent:  { backgroundColor: '#3a3a3c', color: '#ffffff' },
};

// Key representa uma tecla individual do teclado.
// Recebe `status` (melhor status conhecido da letra) para determinar a cor da tecla.
// Teclas especiais (ENTER, ⌫) e letras sem status usam o estilo padrão roxo.
function Key({ label, onKey, status }) {
  const isWide = label === 'ENTER' || label === '⌫';

  // Aplica o estilo do status se existir; caso contrário usa o padrão roxo claro
  const { backgroundColor, color } = STATUS_STYLES[status] || {
    backgroundColor: '#ede9fe',
    color: '#5048e5',
  };

  return (
    <button
      onClick={() => onKey(label)}
      style={{
        width: isWide ? 64 : 40,
        height: 56,
        margin: 3,
        border: 'none',
        borderRadius: 4,
        backgroundColor,
        color,
        fontSize: isWide ? 12 : 16,
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

// Keyboard renderiza o teclado completo com 3 linhas de teclas.
// Recebe `letterStatuses` — mapa { letra → melhor status } — para colorir cada tecla.
function Keyboard({ onKey = () => {}, letterStatuses = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((label) => (
            // Passa o status da letra correspondente; teclas especiais não têm status
            <Key key={label} label={label} onKey={onKey} status={letterStatuses[label]} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
