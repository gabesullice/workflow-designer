/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { validateMachineName, generateMachineNameFromLabel } from './machine-name.js';

describe('validateMachineName', () => {
  const validCases = [
    'draft',
    'needs_review',
    'ready_to_publish',
    'a',
    '_',
    'a_b_c',
    '123abc',
    'abc123',
    '123'
  ];

  const invalidCases = [
    'Draft', // uppercase
    'needs-review', // hyphen
    'needs review', // space
    'needs.review', // dot
    'needs@review', // special char
    '' // empty string
  ];

  it.each(validCases)('should return true for valid machine name: %s', (machineName) => {
    expect(validateMachineName(machineName)).toBe(true);
  });

  it.each(invalidCases)('should return false for invalid machine name: %s', (machineName) => {
    expect(validateMachineName(machineName)).toBe(false);
  });
});

describe('generateMachineNameFromLabel', () => {
  const testCases = [
    // Basic cases
    { input: 'Draft', expected: 'draft', description: 'basic lowercase conversion' },
    { input: 'In Review', expected: 'in_review', description: 'space to underscore' },
    { input: 'Ready to Publish', expected: 'ready_to_publish', description: 'multiple spaces to underscores' },
    
    // Special character cases
    { input: 'Draft (Private)', expected: 'draft_private', description: 'parentheses removal' },
    { input: 'Ready-to-Go!', expected: 'ready_to_go', description: 'hyphen and exclamation removal' },
    { input: 'Needs Review ⭐', expected: 'needs_review', description: 'emoji removal' },
    { input: 'Status: Approved', expected: 'status_approved', description: 'colon removal' },
    { input: 'Content@Manager', expected: 'content_manager', description: 'at symbol converted to underscore' },
    { input: 'Test/Review/Final', expected: 'test_review_final', description: 'slash converted to underscore' },
    
    // Multiple spaces and whitespace
    { input: 'Multiple   Spaces   Here', expected: 'multiple_spaces_here', description: 'multiple spaces collapsed' },
    { input: 'Tab\t\tSeparated', expected: 'tab_separated', description: 'tab characters' },
    
    // Leading and trailing characters
    { input: '  Leading Spaces', expected: 'leading_spaces', description: 'leading spaces trimmed' },
    { input: 'Trailing Spaces  ', expected: 'trailing_spaces', description: 'trailing spaces trimmed' },
    { input: '!@#Start With Symbols', expected: 'start_with_symbols', description: 'leading symbols removed' },
    { input: 'End With Symbols!@#', expected: 'end_with_symbols', description: 'trailing symbols removed' },
    
    // Edge cases
    { input: '!!!', expected: '', description: 'only special characters' },
    { input: '   ', expected: '', description: 'only spaces' },
    { input: '123', expected: '123', description: 'only numbers' },
    { input: 'a1b2c3', expected: 'a1b2c3', description: 'numbers kept in mixed content' },
    { input: 'A', expected: 'a', description: 'single uppercase letter' },
    
    // Complex real-world cases
    { input: 'Version 2.0 (Beta)', expected: 'version_2_0_beta', description: 'version with numbers and parentheses' },
    { input: 'Phase-1: Initial Review', expected: 'phase_1_initial_review', description: 'phase with number and colon' },
    { input: 'Step #3 - Final Approval', expected: 'step_3_final_approval', description: 'step with hash and number' },
    { input: '  Mixed@#$%Content!!! Here  ', expected: 'mixed_content_here', description: 'mixed special chars with spaces' }
  ];

  it.each(testCases)('should convert "$input" to "$expected" ($description)', ({ input, expected }) => {
    expect(generateMachineNameFromLabel(input)).toBe(expected);
  });

  it('should generate valid machine names that pass validation', () => {
    const allInputs = testCases.map(tc => tc.input);
    
    allInputs.forEach(input => {
      const machineName = generateMachineNameFromLabel(input);
      // Only test validation for non-empty results
      if (machineName) {
        expect(validateMachineName(machineName)).toBe(true);
      }
    });
  });
});