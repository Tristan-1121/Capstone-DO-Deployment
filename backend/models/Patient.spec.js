const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'Patient.js');
const src = fs.readFileSync(filePath, 'utf8');

describe('Patient.js schemas - static source checks', () => {
  test('allergySchema is defined with allergen, reaction and severity enum', () => {
    expect(src).toMatch(/const\s+allergySchema\s*=\s*new\s+mongoose\.Schema/);
    expect(src).toMatch(/allergen/);
    expect(src).toMatch(/reaction/);
    expect(src).toMatch(/enum:\s*\[\s*["']Mild["']\s*,\s*["']Moderate["']\s*,\s*["']Severe["']/);
  });

  test('prescriptionSchema is defined with medicationName, dosage and frequency', () => {
    expect(src).toMatch(/const\s+prescriptionSchema\s*=\s*new\s+mongoose\.Schema/);
    expect(src).toMatch(/medicationName/);
    expect(src).toMatch(/dosage/);
    expect(src).toMatch(/frequency/);
  });

  test('mediHistSchema is defined with conditions, surgeries, familyHistory and notes', () => {
    expect(src).toMatch(/const\s+mediHistSchema\s*=\s*new\s+mongoose\.Schema/);
    expect(src).toMatch(/conditions/);
    expect(src).toMatch(/surgeries/);
    expect(src).toMatch(/familyHistory/);
    expect(src).toMatch(/notes/);
  });
});