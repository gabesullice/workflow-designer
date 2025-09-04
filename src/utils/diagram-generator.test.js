/**
 * @vitest-environment node
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { generateWorkflowDiagram } from './diagram-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function loadTestFixture(name) {
  const workflowPath = resolve(__dirname, 'test-fixtures', `${name}.json`);
  const expectedPath = resolve(__dirname, 'test-fixtures', `${name}.expected.md`);
  
  const workflow = JSON.parse(readFileSync(workflowPath, 'utf-8'));
  const expected = readFileSync(expectedPath, 'utf-8').trim();
  
  return { workflow, expected };
}

describe('generateWorkflowDiagram', () => {
  it('generates basic diagram with single transition', () => {
    const { workflow, expected } = loadTestFixture('basic-workflow');
    const result = generateWorkflowDiagram(workflow);
    expect(result.trim()).toBe(expected);
  });

  it('generates diagram with multiple fromStates', () => {
    const { workflow, expected } = loadTestFixture('multiple-from-states');
    const result = generateWorkflowDiagram(workflow);
    expect(result.trim()).toBe(expected);
  });

  it('handles orphaned states', () => {
    const { workflow, expected } = loadTestFixture('orphaned-states');
    const result = generateWorkflowDiagram(workflow);
    expect(result.trim()).toBe(expected);
  });

  it('handles empty workflow', () => {
    const { workflow, expected } = loadTestFixture('empty-workflow');
    const result = generateWorkflowDiagram(workflow);
    expect(result.trim()).toBe(expected);
  });

  it('handles workflow with only states (no transitions)', () => {
    const { workflow, expected } = loadTestFixture('states-only');
    const result = generateWorkflowDiagram(workflow);
    expect(result.trim()).toBe(expected);
  });

  it('handles special characters in labels', () => {
    const { workflow, expected } = loadTestFixture('special-characters');
    const result = generateWorkflowDiagram(workflow);
    expect(result.trim()).toBe(expected);
  });

  it('generates multiple colored edges for multi-role transitions', () => {
    const { workflow, expected } = loadTestFixture('multi-role-edges');
    const result = generateWorkflowDiagram(workflow);
    expect(result.trim()).toBe(expected);
  });
});