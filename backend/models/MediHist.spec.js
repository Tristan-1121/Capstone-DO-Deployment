const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'mediHist.js');
const src = fs.readFileSync(filePath, 'utf8');

describe('mediHist.js schema (static checks)', () => {
  test('defines mediHistSchema and exports it as default', () => {
    expect(src).toMatch(/const\s+mediHistSchema\s*=\s*new\s+mongoose\.Schema/);
    expect(src).toMatch(/export\s+default\s+mediHistSchema/);
  });

  test('has conditions as an array of String', () => {
    expect(src).toMatch(/conditions\s*:\s*\[\s*String\s*\]/);
  });

  test('has surgeries as an array of String', () => {
    expect(src).toMatch(/surgeries\s*:\s*\[\s*String\s*\]/);
  });

  test('has familyHistory and notes fields', () => {
    expect(src).toMatch(/familyHistory\s*:\s*String/);
    expect(src).toMatch(/notes\s*:\s*String/);
  });

  test('imports mongoose at top of file', () => {
    expect(src).toMatch(/import\s+mongoose\s+from\s+['"]mongoose['"]/);
  });
});