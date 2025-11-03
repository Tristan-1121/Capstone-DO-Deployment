const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'allergies.js');
const src = fs.readFileSync(filePath, 'utf8');

describe('allergies.js schema (static checks)', () => {
  test('defines allergySchema and exports it as default', () => {
    expect(src).toMatch(/const\s+allergySchema\s*=\s*new\s+mongoose\.Schema/);
    expect(src).toMatch(/export\s+default\s+allergySchema/);
  });

  test('has allergen and reaction as required strings', () => {
    expect(src).toMatch(/allergen\s*:\s*\{\s*type:\s*String\s*,\s*required:\s*true/);
    expect(src).toMatch(/reaction\s*:\s*\{\s*type:\s*String\s*,\s*required:\s*true/);
  });

  test('severity field has enum and default "Mild"', () => {
    expect(src).toMatch(/severity\s*:\s*\{\s*type:\s*String\s*,\s*enum:\s*\[\s*["']Mild["']\s*,\s*["']Moderate["']\s*,\s*["']Severe["']\s*\]\s*,\s*default:\s*["']Mild["']\s*\}/);
  });

  test('imports mongoose at top of file', () => {
    expect(src).toMatch(/import\s+mongoose\s+from\s+['"]mongoose['"]/);
  });
});