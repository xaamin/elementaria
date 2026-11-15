/**
 * Diff unificado línea a línea (LCS), suficiente para archivos de componentes.
 *
 * @param {string} before
 * @param {string} after
 * @param {{ from?: string, to?: string, context?: number }} [options]
 * @returns {string} Cadena vacía si no hay diferencias.
 */
export function unifiedDiff(before, after, { from = 'local', to = 'registro', context = 3 } = {}) {
  if (before === after) {
    return '';
  }

  const a = before.split('\n');
  const b = after.split('\n');
  const ops = diffLines(a, b);
  const hunks = [];
  let index = 0;

  while (index < ops.length) {
    if (ops[index].type === ' ') {
      index += 1;

      continue;
    }

    const start = Math.max(0, index - context);
    let end = index;

    // Extiende el hunk mientras los cambios estén a menos de 2*context líneas.
    while (end < ops.length) {
      if (ops[end].type !== ' ') {
        end += 1;

        continue;
      }

      let next = end;

      while (next < ops.length && ops[next].type === ' ') {
        next += 1;
      }

      if (next < ops.length && next - end <= context * 2) {
        end = next;
      } else {
        break;
      }
    }

    end = Math.min(ops.length, end + context);

    const slice = ops.slice(start, end);
    const first = slice[0];
    const oldCount = slice.filter(op => op.type !== '+').length;
    const newCount = slice.filter(op => op.type !== '-').length;

    hunks.push(
      [
        `@@ -${first.a + 1},${oldCount} +${first.b + 1},${newCount} @@`,
        ...slice.map(op => `${op.type}${op.line}`),
      ].join('\n'),
    );

    index = end;
  }

  return [`--- ${from}`, `+++ ${to}`, ...hunks].join('\n');
}

/**
 * @param {string[]} a
 * @param {string[]} b
 * @returns {{ type: ' ' | '-' | '+', line: string, a: number, b: number }[]}
 */
function diffLines(a, b) {
  const n = a.length;
  const m = b.length;
  const table = new Int32Array((n + 1) * (m + 1));
  const at = (i, j) => i * (m + 1) + j;

  for (let i = n - 1; i >= 0; i -= 1) {
    for (let j = m - 1; j >= 0; j -= 1) {
      if (a[i] === b[j]) {
        table[at(i, j)] = table[at(i + 1, j + 1)] + 1;
      } else {
        table[at(i, j)] = Math.max(table[at(i + 1, j)], table[at(i, j + 1)]);
      }
    }
  }

  const ops = [];
  let i = 0;
  let j = 0;

  while (i < n || j < m) {
    if (i < n && j < m && a[i] === b[j]) {
      ops.push({ type: ' ', line: a[i], a: i, b: j });
      i += 1;
      j += 1;
    } else if (i < n && (j === m || table[at(i + 1, j)] >= table[at(i, j + 1)])) {
      ops.push({ type: '-', line: a[i], a: i, b: j });
      i += 1;
    } else {
      ops.push({ type: '+', line: b[j], a: i, b: j });
      j += 1;
    }
  }

  return ops;
}
