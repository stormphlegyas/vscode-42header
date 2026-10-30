import assert from 'assert';
import moment = require('moment');
import { extractHeader, getHeaderInfo, renderHeader, HeaderInfo } from '../src/header';

const longUser = 'moustoifa.moumini.with.a.very.long.login';
const longMail = 'moustoifa.moumini.with.a.very.long.login@student.42.fr';

const makeInfo = (user: string, mail: string): HeaderInfo => ({
  filename: 'a_very_long_filename_that_does_not_fit_in_the_header.cpp',
  author: `${user} <${mail}>`,
  createdBy: user,
  createdAt: moment('2024/01/02 03:04:05', 'YYYY/MM/DD HH:mm:ss'),
  updatedBy: user,
  updatedAt: moment('2024/01/02 03:04:05', 'YYYY/MM/DD HH:mm:ss')
});

const headerLines = (header: string) => header.split('\n').slice(0, 11);

// Header generated with values wider than their fields
const deformedHeader = [
  '/******************************************************************************/',
  '/*                                                                            */',
  '/*                                                        :::      ::::::::   */',
  '/*   main.c                                             :+:      :+:    :+:   */',
  '/*                                                    +:+ +:+         +:+     */',
  `/*   By: ${longUser} <${longMail}>                      +#+  +:+       +#+        */`,
  '/*                                                +#+#+#+#+#+   +#+           */',
  `/*   Created: 2024/01/02 03:04:05 by ${longUser}            #+#    #+#             */`,
  `/*   Updated: 2024/01/02 03:04:05 by ${longUser}           ###   ########.fr       */`,
  '/*                                                                            */',
  '/******************************************************************************/',
  '',
  'int main() {}',
].join('\n');

suite('Header Test Suite', () => {
  test('Long username and email are truncated to keep the header width', () => {
    const header = renderHeader('c', makeInfo(longUser, longMail));

    headerLines(header).forEach(line => assert.strictEqual(line.length, 80, line));
    assert(headerLines(header)[5].startsWith(`/*   By: ${longUser.slice(0, 30)}`));
    assert(!headerLines(header)[5].includes(longMail));
    assert(headerLines(header)[7].includes(` by ${longUser.slice(0, 11)}  `));
  });

  test('Wide characters are counted as two columns', () => {
    const user = '学生学生学生学生学生学生';
    const lines = headerLines(renderHeader('c', makeInfo(user, `${user}@student.42.fr`)));
    const expected = headerLines(renderHeader('c', makeInfo('marvin', 'marvin@student.42.fr')));

    lines.forEach((line, index) => {
      const wideCount = (line.match(/[一-鿿]/g) || []).length;
      assert.strictEqual(line.length + wideCount, 80, line);
      assert(line.endsWith(expected[index].slice(50)), line);
    });
  });

  test('Decomposed accents are not counted as extra columns', () => {
    const user = 'Hélène'.normalize('NFD');
    const lines = headerLines(renderHeader('c', makeInfo(user, `${user}@student.42.fr`)));

    lines.forEach(line => assert.strictEqual(line.length, 80, line));
  });

  test('Well-formed header is read back', () => {
    const info = makeInfo('marvin', 'marvin@student.42.fr');
    const header = extractHeader(renderHeader('python', info) + 'print(42)\n');

    assert(header);
    const parsed = getHeaderInfo(header);
    assert.strictEqual(parsed.createdBy, 'marvin');
    assert.strictEqual(parsed.author, 'marvin <marvin@student.42.fr>');
    assert(parsed.createdAt.isSame(info.createdAt));
  });

  test('CRLF header is read back', () => {
    const rendered = renderHeader('c', makeInfo('marvin', 'marvin@student.42.fr'));

    assert(extractHeader(rendered.split('\n').join('\r\n')));
  });

  test('Deformed header is recognized and rendered back at the right width', () => {
    const header = extractHeader(deformedHeader);

    assert(header);
    const parsed = getHeaderInfo(header);
    assert.strictEqual(parsed.createdBy, longUser);
    assert.strictEqual(parsed.createdAt.format('YYYY/MM/DD HH:mm:ss'), '2024/01/02 03:04:05');

    headerLines(renderHeader('c', parsed)).forEach(line => assert.strictEqual(line.length, 80, line));
  });

  test('File without header is not mistaken for one', () => {
    assert.strictEqual(extractHeader('int main() {}\n'), null);
    assert.strictEqual(extractHeader('/* ******************** */\n'.repeat(12)), null);
  });
});
