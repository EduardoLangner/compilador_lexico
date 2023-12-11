// Defina a entrad! Exemplo: int var teste = 50;
let input = "int var teste = 50;";

// Define as expressões regulares para cada tipo de token definido pela sua linguagem

let tokenRegex = [ 
  {type: 'IDENT', regex: /^var [a-zA-Z][a-zA-Z0-9]*/}, 
  {type: 'INT', regex: /^int/},
  {type: 'FLOAT', regex: /^float/},
  {type: 'STRING', regex: /^string/},
  {type: 'BOOL', regex: /^bool/i},
  {type: '=', regex: /^=/},
  {type: '+', regex: /^\+/},
  {type: '-', regex: /^-/},
  {type: '/', regex: /^\//},
  {type: '*', regex: /^\*/},
  {type: 'OP_COMP', regex: /^==/},
  {type: 'OP_AND', regex: /^&&/},
  {type: 'OP_OR', regex: /^\|\|/},
  {type: '>', regex: /^>/},
  {type: '<', regex: /^</},
  {type: '>=', regex: /^>=/},
  {type: '<=', regex: /^<=/},
  {type: '!=', regex: /^!=/},
  {type: '!', regex: /^!/},
  {type: 'IF', regex: /^if/},
  {type: 'ELSE', regex: /^else/},
  {type: 'FOR', regex: /^for/},
  {type: '.', regex: /^\./},
  {type: ';', regex: /^;/},
  {type: 'COMENT', regex: /#[^\n]*#/},
  {type: '(', regex: /^\(/},
  {type: ')', regex: /^\)/},
  {type: '{', regex: /^\{/},
  {type: '}', regex: /^\}/},
  {type: 'INT_POS', regex: /^\d+/},
  {type: 'INT_NEG', regex: /^-\d+/},
  {type: 'FLOAT_POS', regex: /^\d+\.\d+/},
  {type: 'FLOAT_NEG', regex: /^-\d+\.\d+/},
  {type: 'VAL_STRING', regex: /^"([^"]*)"/},
  {type: 'VAL_BOOL', regex: /^(true|false)/i}
];

function token(input) { // Função que executa a análise léxica
  let tokens = [];
  let errors = [];
  let symbols = [];
  let line = 1;

  while (input.length > 0) { // Enquanto houver input
    let combinacao = null; 
    let combinacaoLength = -1;
    let combinacaoIndex = -1;

    for (let i = 0; i < tokenRegex.length; i++) { // Percorre o array de expressões regulares e verifica se alguma casa com o input
      let regex = new RegExp("^" + tokenRegex[i].regex.source); // Cria uma expressão regular a partir da regex do array
      let tokenMatch = input.match(regex); // Verifica se o input casa com a regex

      if (tokenMatch !== null && (combinacao === null || tokenMatch[0].length > combinacaoLength)) { // Se o input casa com a regex e o tamanho da casa for maior que o tamanho da casa anterior
        combinacao = tokenMatch[0]; // Atribui a casa atual à variável combinacao
        combinacaoLength = tokenMatch[0].length; // Atribui o tamanho da casa atual à variável combinacaoLength
        combinacaoIndex = i; // Atribui o índice da casa atual à variável combinacaoIndex
      }
    }

    if (combinacao !== null) { // Se houver uma casa
      let type = tokenRegex[combinacaoIndex].type; // Atribui o tipo da casa à variável type
      let token = { type: type, value: combinacao, line: line }; // Cria um objeto token com o tipo, valor e linha
      tokens.push(token); // Adiciona o token ao array de tokens
      input = input.substring(combinacaoLength); // Remove a casa do input
    } else if (input[0] === "\n") { // Se o caractere atual for uma quebra de linha
      line++; // Incrementa a linha
      input = input.substring(1); // Remove a quebra de linha do input
    } else if (input[0] === "\r" || input[0] === " ") { // Se o caractere atual for um espaço ou um carriage return
      input = input.substring(1); // Remove o caractere do input
    } else { // Se o caractere atual não for reconhecido
      let error = { value: input[0], line: line }; // Cria um objeto error com o caractere e a linha
      errors.push(error); // Adiciona o erro ao array de erros
      input = input.substring(1); // Remove o caractere do input
      combinacaoLength = 1; // Atribui o tamanho da casa como 1
    }
  }

  let accepted = errors.length === 0; // Se não houver erros, a entrada é aceita
  return { tokens: tokens, errors: errors, symbols: symbols, accepted: accepted }; // Retorna os tokens, erros, símbolos e se a entrada foi aceita
}

// Executa a análise léxica da entrada
let result = token(input);

// Imprime o resultado da análise léxica
if (result.accepted) {
  console.log("A entrada foi aceita\n");
  console.log("Tokens: ");
  let tokenArray = result.tokens.map((token) => {
    return token.type;
  });
  console.log(tokenArray);
} else {
  console.log("A entrada não foi aceita\n");
  console.log("Erros:");
  result.errors.forEach((error) => {
    console.log(`- Caractere '${error.value}' inválido no input!`);
  });
}

function sintatico() {

  const tokenArray = result.tokens.map((token) => {
    return token.type;
  });

  let currentIndex = 0; // Índice atual no array de tokens

  function consume(tokenType) {
    // Verifica se o token atual é do tipo esperado
    if (tokenArray[currentIndex] === tokenType) {
      currentIndex++; // Avança para o próximo token
    } else {
      // Emite um erro de sintaxe
      throw new Error(`\nErro de sintaxe. Token '${tokenArray[currentIndex]}' inesperado.`);
    }
  }

  function Q0() { // Construção do autômato finito
    if (tokenArray[currentIndex] === 'INT' || tokenArray[currentIndex] === 'FLOAT' || tokenArray[currentIndex] === 'STRING' || tokenArray[currentIndex] === 'BOOL') { // Se o token atual for um tipo
      Q1(); // Chama o estado Q1
      Q2(); // Chama o estado Q2
      consume('='); // Consome o token '='
      Q3(); // Chama o estado Q3
      consume(';'); // Consome o token ';'
      Q4(); // Chama o estado Q4
    } else if (tokenArray[currentIndex] === '#') { // Se o token atual for um comentário
      consume('#'); // Consome o token '#'
      Q4(); // Chama o estado Q4
      consume('#'); // Consome o token '#'
    } else if (tokenArray[currentIndex] === 'IDENT') { // Se o token atual for um identificador
      consume('IDENT');  // Consome o token 'IDENT'
      consume('='); // Consome o token '='
      consume('IDENT'); // Consome o token 'IDENT'
      Q5(); // Chama o estado Q5
      consume('IDENT'); // Consome o token 'IDENT'
      consume(';'); // Consome o token ';'
    } else if (tokenArray[currentIndex] === 'IF') {
      consume('IF');
      consume('(');
      Q6();
      Q7();
      Q8();
      Q6();
      Q7();
      Q10();
      consume(')');
      consume('{');
      Q4();
      consume('}');
      Q12();
    } else if (tokenArray[currentIndex] === 'FOR') {
      consume('FOR');
      consume('(');
      consume('IDENT');
      consume('=');
      consume('INT_POS');
      consume(';');
      consume('IDENT');
      Q8();
      consume('INT_POS');
      consume(';');
      consume('IDENT');
      consume(')');
      consume('{');
      Q4();
      consume('}');
      Q4();
    } else {
      // Emite um erro de sintaxe se nenhum dos padrões corresponder
      throw new Error(`\nErro de sintaxe. Token '${tokenArray[currentIndex]}' inesperado.`);
    }
  }

  function Q1() {
    if (tokenArray[currentIndex] === 'INT' || tokenArray[currentIndex] === 'FLOAT' || tokenArray[currentIndex] === 'STRING' || tokenArray[currentIndex] === 'BOOL') {
      consume(tokenArray[currentIndex]);
    } else {
      // Emite um erro de sintaxe se o tipo esperado não for encontrado
      throw new Error(`\nErro de sintaxe. Tipo esperado encontrado '${tokenArray[currentIndex]}'`);
    }
  }

  function Q2() {
    if (tokenArray[currentIndex] === 'IDENT') {
      consume('IDENT');
    } else {
      // Emite um erro de sintaxe se o identificador esperado não for encontrado
      throw new Error(`\nErro de sintaxe. Identificador esperado encontrado '${tokenArray[currentIndex]}'`);
    }
  }

  function Q3() {
    if (tokenArray[currentIndex] === 'INT_POS' || tokenArray[currentIndex] === 'INT_NEG' || tokenArray[currentIndex] === 'FLOAT_POS' || tokenArray[currentIndex] === 'FLOAT_NEG' || tokenArray[currentIndex] === 'VAL_STRING' || tokenArray[currentIndex] === 'VAL_BOOL') {
      consume(tokenArray[currentIndex]);
    } else {
      // Emite um erro de sintaxe se o valor esperado não for encontrado
      throw new Error(`\nErro de sintaxe. Valor esperado encontrado '${tokenArray[currentIndex]}'`);
    }
  }

  function Q4() {
    if (tokenArray[currentIndex] === 'INT' || tokenArray[currentIndex] === 'FLOAT' || tokenArray[currentIndex] === 'STRING' || tokenArray[currentIndex] === 'BOOL' || tokenArray[currentIndex] === '#' || tokenArray[currentIndex] === 'IDENT' || tokenArray[currentIndex] === 'IF' || tokenArray[currentIndex] === 'FOR') {
      Q1();
      Q2();
      consume('=');
      Q3();
      consume(';');
      Q4();
    } else if (tokenArray[currentIndex] === '#') {
      consume('#');
      Q4();
      consume('#');
    } else if (tokenArray[currentIndex] === 'IDENT') {
      consume('IDENT');
      consume('=');
      consume('IDENT');
      Q5();
      consume('IDENT');
      consume(';');
    } else if (tokenArray[currentIndex] === 'IF') {
      consume('IF');
      consume('(');
      Q6();
      Q7();
      Q8();
      Q6();
      Q7();
      Q10();
      consume(')');
      consume('{');
      Q4();
      consume('}');
      Q12();
    } else if (tokenArray[currentIndex] === 'FOR') {
      consume('FOR');
      consume('(');
      consume('IDENT');
      consume('=');
      consume('INT_POS');
      consume(';');
      consume('IDENT');
      Q8();
      consume('INT_POS');
      consume(';');
      consume('IDENT');
      consume(')');
      consume('{');
      Q4();
      consume('}');
      Q4();
    } else {
      // Caso base: se nenhum token esperado for encontrado, retorna
      return;
    }
  }

  function Q5() {
    if (tokenArray[currentIndex] === '+' || tokenArray[currentIndex] === '-' || tokenArray[currentIndex] === '*' || tokenArray[currentIndex] === '/') {
      consume(tokenArray[currentIndex]);
    } else {
      // Emite um erro de sintaxe se o operador esperado não for encontrado
      throw new Error(`\nErro de sintaxe. Operador esperado encontrado '${tokenArray[currentIndex]}'`);
    }
  }

  function Q6() {
    if (tokenArray[currentIndex] === '!' || tokenArray[currentIndex] === '&') {
      consume(tokenArray[currentIndex]);
    } else {
      // Emite um erro de sintaxe se o operador esperado não for encontrado
      throw new Error(`\nErro de sintaxe. Operador esperado encontrado '${tokenArray[currentIndex]}'`);
    }
  }

  function Q7() {
    if (tokenArray[currentIndex] === 'IDENT' || tokenArray[currentIndex] === 'INT_POS' || tokenArray[currentIndex] === 'INT_NEG' || tokenArray[currentIndex] === 'FLOAT_POS' || tokenArray[currentIndex] === 'FLOAT_NEG' || tokenArray[currentIndex] === 'VAL_STRING' || tokenArray[currentIndex] === 'VAL_BOOL') {
      consume(tokenArray[currentIndex]);
    } else {
      // Emite um erro de sintaxe se o valor esperado não for encontrado
      throw new Error(`\nErro de sintaxe. Valor esperado encontrado '${tokenArray[currentIndex]}'`);
    }
  }

  function Q8() {
    if (
      tokenArray[currentIndex] === '>' ||
      tokenArray[currentIndex] === '<' ||
      tokenArray[currentIndex] === '>=' ||
      tokenArray[currentIndex] === '<=' ||
      tokenArray[currentIndex] === '!=' ||
      tokenArray[currentIndex] === 'OP_COMP' ||
      tokenArray[currentIndex] === 'OP_AND' ||
      tokenArray[currentIndex] === 'OP_OR'
    ) {
      consume(tokenArray[currentIndex]);
    } else {
      // Emite um erro de sintaxe se o operador esperado não for encontrado
      throw new Error(`\nErro de sintaxe. Operador esperado encontrado '${tokenArray[currentIndex]}'`);
    }
  }

  function Q9() {
    if (tokenArray[currentIndex] === '++' || tokenArray[currentIndex] === '--') {
      consume(tokenArray[currentIndex]);
    } else {
      // Emite um erro de sintaxe se o operador esperado não for encontrado
      throw new Error(`\nErro de sintaxe. Operador esperado encontrado '${tokenArray[currentIndex]}'`);
    }
  }

  function Q10() {
    if (tokenArray[currentIndex] === 'OP_AND' || tokenArray[currentIndex] === 'OP_OR') {
      consume(tokenArray[currentIndex]);
      Q6();
      Q7();
      Q8();
      Q6();
      Q7();
    } else {
      // Emite um erro de sintaxe se o operador esperado não for encontrado
      throw new Error(`\nErro de sintaxe. Operador esperado encontrado '${tokenArray[currentIndex]}'`);
    }
  }

  function Q11() {
    if (tokenArray[currentIndex] === 'OP_AND' || tokenArray[currentIndex] === 'OP_OR') {
      consume(tokenArray[currentIndex]);
    } else {
      // Emite um erro de sintaxe se o operador esperado não for encontrado
      throw new Error(`\nErro de sintaxe. Operador esperado encontrado '${tokenArray[currentIndex]}'`);
    }
  }

  function Q12() {
    if (tokenArray[currentIndex] === 'ELSE') {
      consume('ELSE');
      consume('{');
      Q4();
      consume('}');
    } else {
      Q4();
    }
  }

  try {
    Q0(); // Inicia a análise sintática a partir do símbolo inicial Q0
    console.log('\nA entrada foi aceita');
  } catch (error) {
    console.log('\nA entrada não foi aceita');
    console.log('Erro de sintaxe:', error.message);
  }
}

sintatico();