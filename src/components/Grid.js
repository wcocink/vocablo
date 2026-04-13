import React from 'react';

// Número de tentativas (linhas) e letras por palavra (colunas)
const ROWS = 6;
const COLS = 5;

// Mapeia cada status para uma cor de fundo
const STATUS_COLORS = {
  correct: '#6aaa64', // verde: letra certa no lugar certo
  present: '#c9b458', // amarelo: letra certa no lugar errado
  absent:  '#787c7e', // cinza escuro: letra não existe na palavra
};

// Cell representa uma única célula da grade
// Recebe uma letra e um status para definir a cor de fundo
function Cell({ letter, status }) {
  // Se há status, usa a cor correspondente; caso contrário, fundo branco
  const backgroundColor = STATUS_COLORS[status] || '#ffffff';

  // Texto branco sobre células coloridas, escuro sobre células vazias
  const color = status ? '#ffffff' : '#000000';

  // Borda colorida quando há status, cinza padrão para células sem status
  const border = status ? `2px solid ${backgroundColor}` : '2px solid #ccc';

  return (
    <div style={{
      width: 60,           // largura fixa de 60px
      height: 60,          // altura fixa de 60px
      border,
      backgroundColor,
      color,
      display: 'flex',
      alignItems: 'center',     // centraliza verticalmente
      justifyContent: 'center', // centraliza horizontalmente
      fontSize: 28,
      fontWeight: 'bold',
      textTransform: 'uppercase', // garante que a letra seja exibida em maiúsculo
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
  // Monta a matriz de células com base nas tentativas e resultados
  const rows = Array.from({ length: ROWS }, (_, rowIndex) => {
    const word = guesses[rowIndex] || '';

    // Resultado da linha, se já foi submetida; undefined para linhas sem resultado
    const result = results[rowIndex];

    return Array.from({ length: COLS }, (_, colIndex) => ({
      letter: word[colIndex] || '',
      // Usa o status do resultado se disponível; undefined para tentativa atual e linhas vazias
      status: result ? result[colIndex].status : undefined,
    }));
  });

  return (
    // Container principal: empilha as linhas verticalmente com espaçamento
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map((row, rowIndex) => (
        // Cada linha exibe suas 5 células lado a lado
        <div key={rowIndex} style={{ display: 'flex', gap: 8 }}>
          {row.map(({ letter, status }, colIndex) => (
            <Cell key={colIndex} letter={letter} status={status} />
          ))}
        </div>
      ))}
    </div>
  );
}

export default Grid;
