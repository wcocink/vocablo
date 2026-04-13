import React from 'react';

// Layout do teclado dividido em 3 linhas, seguindo o padrão QWERTY em português
const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫'],
];

// Key representa uma tecla individual do teclado
// Recebe o rótulo da tecla e uma função onKey chamada ao clicar
function Key({ label, onKey }) {
  // Teclas especiais (ENTER e ⌫) são mais largas que as demais
  const isWide = label === 'ENTER' || label === '⌫';

  return (
    <button
      onClick={() => onKey(label)}
      style={{
        width: isWide ? 64 : 40,  // largura maior para teclas especiais
        height: 56,
        margin: 3,
        border: 'none',
        borderRadius: 4,
        backgroundColor: '#d3d6da',
        fontSize: isWide ? 12 : 16,
        fontWeight: 'bold',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  );
}

// Keyboard renderiza o teclado completo com 3 linhas de teclas
// Recebe a prop `onKey`, chamada com a tecla pressionada como argumento
function Keyboard({ onKey = () => {} }) {
  return (
    // Container principal: centraliza as linhas do teclado
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 24 }}>
      {ROWS.map((row, rowIndex) => (
        // Cada linha agrupa suas teclas lado a lado
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((label) => (
            <Key key={label} label={label} onKey={onKey} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Keyboard;
