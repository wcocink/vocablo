import React from 'react';

const ROWS = 6;
const COLS = 5;

const STATUS_COLORS = {
  correct: '#22C55E',
  present: '#EAB308',
  absent:  '#3F3F46',
};

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
 * 1. `status` definido (tentativa submetida): flip/win-reveal animation.
 * 2. `isCurrentRow` true: célula clicável da linha em andamento.
 *    - `isSelected` true: borda branca indicando foco.
 *    - Com letra: fundo secundário + animação pop ao digitar.
 *    - Sem letra: fundo transparente.
 * 3. Linha futura: borda sutil #3F3F46, sem interação.
 */
function Cell({ letter, status, animate, colIndex, isWinRow, isCurrentRow, isSelected, onClick }) {
  // Célula submetida
  if (status) {
    const animClass = isWinRow ? 'cell-win-reveal' : 'cell-flip';
    return (
      <div
        className={`grid-cell ${animClass}`}
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

  // Célula da linha atual (clicável)
  if (isCurrentRow) {
    return (
      <div
        className={`grid-cell${animate ? ' cell-pop' : ''}`}
        style={{
          ...BASE_STYLE,
          border: isSelected ? '2px solid #FAFAFA' : '1px solid #3F3F46',
          backgroundColor: letter ? '#18181B' : 'transparent',
          color: '#FAFAFA',
          cursor: 'pointer',
        }}
        onClick={onClick}
      >
        {letter}
      </div>
    );
  }

  // Célula de linha futura
  return (
    <div className="grid-cell" style={{
      ...BASE_STYLE,
      border: '1px solid #3F3F46',
      backgroundColor: 'transparent',
      color: '#FAFAFA',
    }}>
      {letter}
    </div>
  );
}

/*
 * Grid — grade 6×5 do jogo.
 *
 * Props:
 * - guesses     : palavras digitadas (submetidas + linha atual como array)
 * - results     : resultados do checkGuess, um array por tentativa submetida
 * - shakeRow    : índice da linha que deve agitar (tentativa inválida)
 * - selectedCol : coluna focada na linha atual (null quando jogo encerrado)
 * - onCellClick : callback(colIndex) chamado ao clicar numa célula da linha atual
 */
function Grid({ guesses = [], results = [], shakeRow = null, selectedCol = null, onCellClick }) {
  const currentRowIndex = results.length;

  const rows = Array.from({ length: ROWS }, (_, rowIndex) => {
    const word        = guesses[rowIndex] || '';
    const result      = results[rowIndex];
    const isCurrentRow = rowIndex === currentRowIndex && onCellClick !== undefined;
    const isWinRow    = !!(result && result.every(item => item.status === 'correct'));

    return {
      isCurrentRow,
      isWinRow,
      shouldShake: rowIndex === shakeRow,
      cells: Array.from({ length: COLS }, (_, colIndex) => ({
        letter:     word[colIndex] || '',
        status:     result ? result[colIndex].status : undefined,
        animate:    isCurrentRow && !!(word[colIndex]),
        isCurrentRow,
        isSelected: isCurrentRow && colIndex === selectedCol,
        colIndex,
      })),
    };
  });

  return (
    <div className="grid-container" style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%', maxWidth: 360 }}>
      {rows.map(({ cells, isCurrentRow, isWinRow, shouldShake }, rowIndex) => (
        <div
          key={shouldShake ? `shake-${rowIndex}` : rowIndex}
          className={`grid-row${shouldShake ? ' row-shake' : ''}`}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}
        >
          {cells.map(({ letter, status, animate, isCurrentRow, isSelected, colIndex }) => (
            <Cell
              key={isCurrentRow ? `${colIndex}-${letter}` : colIndex}
              letter={letter}
              status={status}
              animate={animate}
              colIndex={colIndex}
              isWinRow={isWinRow}
              isCurrentRow={isCurrentRow}
              isSelected={isSelected}
              onClick={isCurrentRow ? () => onCellClick(colIndex) : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;
