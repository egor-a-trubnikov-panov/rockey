/**
 * NOTE That this is very very experimental optimization and is not used
 * at production.
 */
const path = require('path');
const fs = require('fs');

const PARSE_SOURCE_JS = path.resolve(__dirname, '..', 'lib', 'parse.js');
const parseSource = fs.readFileSync(PARSE_SOURCE_JS).toString();

const parse = code => {
  const regexp = /\/\/ @replace-start([\s\S]*?)\/\/ @replace-end/gm;

  let updateSource = code;
  let parts = null;

  while ((parts = regexp.exec(code))) {
    const decl = parts[1];
    const splited = decl.split(/\n/);

    const funcParts = /\s*([^\s]+)\s*=\s*\(?([^\)]*)\)?\s*=>/m.exec(splited[1]);
    const func = funcParts[1] + '\\(' + (funcParts[2].trim() || '') + '\\)';
    let body = splited.slice(2, splited.length - 2).join('').trim();

    if (body[body.length - 1] === ';') {
      body = body.slice(0, -1);
    }

    if (body.indexOf('return') !== -1) {
      body = body.replace('return', '');
      updateSource = updateSource.replace(
        new RegExp(func, 'mg'),
        '(' + body + ')'
      );
    } else {
      updateSource = updateSource.replace(new RegExp(func, 'mg'), body);
    }
  }

  return updateSource;
};

let updateSource = parseSource.replace(
  /\/\/ @remove-start([\s\S]*?)\/\/ @remove-end/gm,
  ''
);
updateSource = parse(updateSource);

// replase nested functions
updateSource = parse(updateSource);

updateSource = updateSource
  .replace(/\/\/ @replace-start([\s\S]*?)\/\/ @replace-end/gm, '')
  .replace(/\s+/, ' ')
  .split(/\n+/)
  .filter(line => !!line.trim())
  .join('\n');

updateSource = `/**
 * --------------------------------------------------------------
 * --------------------------------------------------------------
 * NOTE this is autogenerated module. Does not change it manually
 * generated via: npm run optimize-parse
 * --------------------------------------------------------------
 * --------------------------------------------------------------
 */
${updateSource}
`;

fs.writeFileSync(
  path.resolve(__dirname, '..', 'lib', 'parseOptimized.js'),
  updateSource
);