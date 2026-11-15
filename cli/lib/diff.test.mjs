import { expect, test } from '@jest/globals';

import { unifiedDiff } from './diff.mjs';

test('no produce salida para contenidos iguales', () => {
  expect(unifiedDiff('a\nb\n', 'a\nb\n')).toBe('');
});

test('muestra las líneas cambiadas con su contexto', () => {
  const before = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].join('\n');
  const after = ['1', '2', '3', '4', 'cinco', '6', '7', '8', '9'].join('\n');

  expect(unifiedDiff(before, after, { from: 'a', to: 'b' })).toBe(
    ['--- a', '+++ b', '@@ -2,7 +2,7 @@', ' 2', ' 3', ' 4', '-5', '+cinco', ' 6', ' 7', ' 8'].join('\n'),
  );
});
