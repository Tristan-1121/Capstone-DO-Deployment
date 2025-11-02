const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'appointments.js');
const src = fs.readFileSync(filePath, 'utf8');

describe('appointments.js schema (static checks)', () => {
  test('defines appointmentSchema and exports a model', () => {
    expect(src).toMatch(/const\s+appointmentSchema\s*=\s*new\s+mongoose\.Schema/);
    expect(src).toMatch(/export\s+default\s+mongoose\.model\(\s*['"]Appointment['"]/);
  });

  test('patientId and practitionerId are ObjectId refs to User and indexed', () => {
    expect(src).toMatch(/patientId\s*:\s*\{\s*type:\s*mongoose\.Schema\.Types\.ObjectId/);
    expect(src).toMatch(/ref:\s*['"]User['"]/);
    expect(src).toMatch(/practitionerId\s*:\s*\{\s*type:\s*mongoose\.Schema\.Types\.ObjectId/);
    expect(src).toMatch(/index:\s*true/);
  });

  test('reason field is required string with trim', () => {
    expect(src).toMatch(/reason\s*:\s*\{\s*type:\s*String\s*,\s*required:\s*true\s*,\s*trim:\s*true/);
  });

  test('start and end are Dates with start indexed and required', () => {
    expect(src).toMatch(/start\s*:\s*\{\s*type:\s*Date\s*,\s*required:\s*true\s*,\s*index:\s*true/);
    expect(src).toMatch(/end\s*:\s*\{\s*type:\s*Date\s*,\s*required:\s*true/);
  });

  test('status has expected enum and default and is indexed', () => {
    expect(src).toMatch(/status\s*:\s*\{\s*type:\s*String\s*,\s*enum:\s*\[\s*['"]scheduled['"]/);
    expect(src).toMatch(/default:\s*['"]scheduled['"]/);
    expect(src).toMatch(/index:\s*true/);
  });

  test('schema uses timestamps option and defines compound index', () => {
    expect(src).toMatch(/\{\s*timestamps\s*:\s*true\s*\}/);
    expect(src).toMatch(/appointmentSchema\.index\(\s*\{\s*practitionerId:\s*1\s*,\s*start:\s*1\s*\}\s*\)/);
  });
});