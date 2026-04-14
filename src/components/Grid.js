import React from 'react';

// Número de tentativas (linhas) e letras por palavra (colunas)
const ROWS = 6;
const COLS = 5;

// Mapeia cada status para uma cor de fundo
const STATUS_COLORS = {
  correct: '#538d4e', // verde: letra certa no lugar certo
  present: '#b59f3b', // amarelo: letra certa no lugar errado
  absent:  '#3a3a3c', // cinza escuro: letra não existe na palavra
};

// Cell representa uma única célula da grade.
// A prop `animate` ativa a animação "pop" quando uma letra é digitada
// na tentativa atual. Usamos `key` baseado na letra (ver Grid) para
// forçar remontagem da célula sempre que a letra muda, fazendo a
// animação CSS disparar do zero a cada novo caractere digitado.
function Cell({ letter, status, animate }) {
  // `animate` é true para células da tentativa atual com letra digitada.
  // Três casos possíveis:
  // 1. Tem status (tentativa submetida): cor do STATUS_COLORS, letra branca
  // 2. Tentativa atual com letra (animate): fundo branco, borda e letra roxas
  // 3. Vazia ou sem status: fundo branco, borda cinza
  let backgroundColor, color, border;

  if (status) {
    backgroundColor = STATUS_COLORS[status];
    color  = '#ffffff';
    border = `2px solid ${backgroundColor}`;
  } else if (animate) {
    backgroundColor = '#ffffff';
    color  = '#5048e5';
    border = '2px solid #5048e5';
  } else {
    backgroundColor = '#ffffff';
    color  = '#000000';
    border = '2px solid #d0d0d0';
  }

  return (
    <div style={{
      width: 60,
      height: 60,
      border,
      borderRadius: 6,
      backgroundColor,
      color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      fontSize: 22,
      fontWeight: 700,
      textTransform: 'uppercase',
      // Aplica a animação "pop" apenas quando `animate` for true
      animation: animate ? 'pop 100ms ease-in-out' : 'none',
    }}>
      {letter}
    </div>
  );
}

// Grid renderiza a grade completa do jogo: 6 linhas × 5 colunas
// Recebe:
// - guesses: array de strings com as palavras digitadas (submetidas + atual)
// - results: array de resultados do checkGuess, um por tentativa submetida
function Grid({ guesses = [], results = [] }) {
  // A linha atual (sem resultado ainda) é sempre a de índice results.length:
  // cada submissão adiciona um item a results, avançando o índice.
  const currentRowIndex = results.length;

  const rows = Array.from({ length: ROWS }, (_, rowIndex) => {
    const word = guesses[rowIndex] || '';
    const result = results[rowIndex];

    // Identifica se esta linha é a tentativa atual (ainda não submetida)
    const isCurrentRow = rowIndex === currentRowIndex;

    return {
      isCurrentRow,
      cells: Array.from({ length: COLS }, (_, colIndex) => ({
        letter: word[colIndex] || '',
        status: result ? result[colIndex].status : undefined,
        // Anima apenas células com letra na linha atual
        animate: isCurrentRow && !!(word[colIndex]),
      })),
    };
  });

  return (
    <div>
      {/* Keyframes da animação "pop": escala de 1 → 1.08 → 1 em 100ms */}
      <style>{`
        @keyframes pop {
          0%   { transform: scale(1);    }
          50%  { transform: scale(1.08); }
          100% { transform: scale(1);    }
        }
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rows.map(({ cells, isCurrentRow }, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', gap: 8 }}>
            {cells.map(({ letter, status, animate }, colIndex) => (
              // Usar `colIndex-letter` como key na linha atual força a remontagem
              // da célula a cada mudança de letra, reiniciando a animação CSS.
              // Nas demais linhas, a key fixa evita remontagens desnecessárias.
              <Cell
                key={isCurrentRow ? `${colIndex}-${letter}` : colIndex}
                letter={letter}
                status={status}
                animate={animate}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Grid;
