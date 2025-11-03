const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'User.js');
const src = fs.readFileSync(filePath, 'utf8');

describe('User schema (static checks)', () => {
  test('defines a mongoose schema', () => {
    expect(src).toMatch(/const\s+userSchema\s*=\s*new\s+mongoose\.Schema/);
  });

  test('has username, email and password with required/unique where applicable', () => {
    expect(src).toMatch(/username\s*:\s*\{\s*type:\s*String\s*,\s*required:\s*true\s*,\s*unique:\s*true/);
    expect(src).toMatch(/email\s*:\s*\{\s*type:\s*String\s*,\s*required:\s*true\s*,\s*unique:\s*true/);
    expect(src).toMatch(/password\s*:\s*\{\s*type:\s*String\s*,\s*required:\s*true/);
  });

  test('includes patient profile fields fullName, age and weight with appropriate validators', () => {
    expect(src).toMatch(/fullName\s*:\s*\{\s*type:\s*String\s*,\s*trim:\s*true\s*\}/);
    expect(src).toMatch(/age\s*:\s*\{\s*type:\s*Number\s*,\s*min:\s*0\s*\}/);
    expect(src).toMatch(/weight\s*:\s*\{\s*type:\s*Number\s*,\s*min:\s*0\s*\}/);
  });

  test('role field is enum with patient, practitioner, admin and default patient', () => {
    expect(src).toMatch(/role\s*:\s*\{\s*type:\s*String\s*,\s*enum:\s*\[\s*['"]patient['"]\s*,\s*['"]practitioner['"]\s*,\s*['"]admin['"]\s*\]\s*,\s*default:\s*['"]patient['"]/);
  });

  test('healthHistory is an array of trimmed strings', () => {
    expect(src).toMatch(/healthHistory\s*:\s*\[\s*\{\s*type:\s*String\s*,\s*trim:\s*true\s*\}\s*\]/);
  });

  test('schema enables timestamps', () => {
    expect(src).toMatch(/\{\s*timestamps\s*:\s*true\s*\}\s*\)\s*;?/);
  });
});