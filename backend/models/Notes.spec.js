const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'notes.js');
const src = fs.readFileSync(filePath, 'utf8');

describe('notes.js schema (static checks)', () => {
  test('exports a noteSchema', () => {
    expect(src).toMatch(/const\s+noteSchema\s*=\s*new\s+mongoose\.Schema/);
    expect(src).toMatch(/export\s+default\s+noteSchema/);
  });

  test('noteSchema has required content string', () => {
    expect(src).toMatch(/content:\s*\{\s*type:\s*String\s*,\s*required:\s*true\s*\}/);
  });

  test('noteSchema has date with default Date.now', () => {
    expect(src).toMatch(/date:\s*\{\s*type:\s*Date\s*,\s*default:\s*Date\.now\s*\}/);
  });

  test('noteSchema is defined with _id: false option', () => {
    expect(src).toMatch(/\{\s*_id:\s*false\s*\}\s*\)/);
  });
});