import readline from 'node:readline/promises';

const useColor = process.stdout.isTTY && !process.env.NO_COLOR;

const paint = code => text => (useColor ? `\u001b[${code}m${text}\u001b[0m` : String(text));

export const color = {
  bold: paint(1),
  dim: paint(2),
  red: paint(31),
  green: paint(32),
  yellow: paint(33),
  cyan: paint(36),
};

/** Colorea un diff unificado. */
export function colorDiff(diff) {
  return diff
    .split('\n')
    .map(line => {
      if (line.startsWith('@@')) {
        return color.cyan(line);
      }

      if (line.startsWith('+')) {
        return color.green(line);
      }

      if (line.startsWith('-')) {
        return color.red(line);
      }

      return line;
    })
    .join('\n');
}

/** ¿Se pueden hacer preguntas al usuario? */
export function interactive() {
  return Boolean(process.stdin.isTTY && process.stdout.isTTY);
}

/**
 * Pregunta con opciones de una letra. Devuelve la letra elegida.
 *
 * @param {string} question
 * @param {string[]} choices Letras válidas; la primera es la opción por defecto.
 */
export async function ask(question, choices) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  try {
    const hint = choices.map((choice, index) => (index === 0 ? choice.toUpperCase() : choice)).join('/');

    for (;;) {
      const answer = (await rl.question(`${question} [${hint}] `)).trim().toLowerCase();

      if (answer === '') {
        return choices[0];
      }

      if (choices.includes(answer)) {
        return answer;
      }
    }
  } finally {
    rl.close();
  }
}
