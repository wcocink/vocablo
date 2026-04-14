import React from 'react';
import './Grid.css';

const ROWS = 6;
const COLS = 5;

// Cores de destino usadas pelo keyframe `flip` via CSS custom property --bg
const STATUS_COLORS = {
  correct: '#22C55E',
  present: '#EAB308',
  absent:  '#3F3F46',
};

// Estilos estruturais compartilhados por todas as células
const BASE_STYLE = {
  width: '100%',
  aspectRatio: '1',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 8,
  fontFamily: 'sans-serif',
  fontWeight: 700,
  fontSize: 20,
  textTransform: 'uppercase',
  userSelect: 'none',
};

/*
 * Cell — célula individual da grade.
 *
 * Casos:
 * 1. `status` definido (tentativa submetida):
 *    - Linha vencedora → `cell-win-reveal` (flip + pop de celebração).
 *    - Demais          → `cell-flip`.
 *    - Cores gerenciadas pelo keyframe via --bg (não podem ser inline).
 * 2. `animate` true (tentativa atual com letra): borda visível + animação pop.
 * 3. Vazia ou sem letra na tentativa atual: borda sutil, sem animação.
 */
function Cell({ letter, status, animate, colIndex, isWinRow }) {
  if (status) {
    const animClass = isWinRow ? 'cell-win-reveal' : 'cell-flip';
    return (
      <div
        className={animClass}
        style={{
          ...BASE_STYLE,
          '--bg':    STATUS_COLORS[status],
          '--delay': `${colIndex * 150}ms`,
          borderWidth: 2,
          borderStyle: 'solid',
        }}
      >
        {letter}
      </div>
    );
  }

  if (animate) {
    return (
      <div
        className="cell-pop"
        style={{
          ...BASE_STYLE,
          border: '2px solid #71717a',
          backgroundColor: '#18181B',
          color: '#ffffff',
        }}
      >
        {letter}
      </div>
    );
  }

  return (
    <div style={{
      ...BASE_STYLE,
      border: '1px solid #3f3f46',
      backgroundColor: 'transparent',
      color: '#d4d4d8',
    }}>
      {letter}
    </div>
  );
}

/*
 * Grid — grade 6×5 do jogo.
 *
 * Props:
 * - guesses  : palavras digitadas (submetidas + atual em andamento)
 * - results  : resultados do checkGuess, um array por tentativa submetida
 * - shakeRow : índice da linha que deve agitar (tentativa inválida)
 */
function Grid({ guesses = [], results = [], shakeRow = null }) {
  const currentRowIndex = results.length;

  const rows = Array.from({ length: ROWS }, (_, rowIndex) => {
    const word   = guesses[rowIndex] || '';
    const result = results[rowIndex];
    const isCurrentRow = rowIndex === currentRowIndex;

    // Linha vencedora: todas as letras são 'correct'
    const isWinRow = !!(result && result.every(item => item.status === 'correct'));

    return {
      isCurrentRow,
      isWinRow,
      shouldShake: rowIndex === shakeRow,
      cells: Array.from({ length: COLS }, (_, colIndex) => ({
        letter:  word[colIndex] || '',
        status:  result ? result[colIndex].status : undefined,
        animate: isCurrentRow && !!(word[colIndex]),
        colIndex,
      })),
    };
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 280 }}>
      {rows.map(({ cells, isCurrentRow, isWinRow, shouldShake }, rowIndex) => (
        // key com shakeRow força remontagem da div, reiniciando a animação CSS.
        <div
          key={shouldShake ? `shake-${rowIndex}` : rowIndex}
          className={shouldShake ? 'row-shake' : undefined}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}
        >
          {cells.map(({ letter, status, animate, colIndex }) => (
            // key dinâmica na linha atual: força remontagem ao digitar cada letra,
            // reiniciando o pop. Quando a linha transita para "submetida", a key
            // muda (ex: "0-A" → 0), remontando a célula e iniciando o flip.
            <Cell
              key={isCurrentRow ? `${colIndex}-${letter}` : colIndex}
              letter={letter}
              status={status}
              animate={animate}
              colIndex={colIndex}
              isWinRow={isWinRow}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;
