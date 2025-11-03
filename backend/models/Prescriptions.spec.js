const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'prescriptions.js');
const src = fs.readFileSync(filePath, 'utf8');

describe('prescriptions.js schema (static checks)', () => {
  test('defines prescriptionSchema and exports it as default', () => {
    expect(src).toMatch(/const\s+prescriptionSchema\s*=\s*new\s+mongoose\.Schema/);
    expect(src).toMatch(/export\s+default\s+prescriptionSchema/);
  });

  test('has medicationName, dosage and frequency as required strings', () => {
    expect(src).toMatch(/medicationName\s*:\s*\{\s*type:\s*String\s*,\s*required:\s*true/);
    expect(src).toMatch(/dosage\s*:\s*\{\s*type:\s*String\s*,\s*required:\s*true/);
    expect(src).toMatch(/frequency\s*:\s*\{\s*type:\s*String\s*,\s*required:\s*true/);
  });

  test('imports mongoose at top of file', () => {
    expect(src).toMatch(/import\s+mongoose\s+from\s+['"]mongoose['"]/);
  });
});
