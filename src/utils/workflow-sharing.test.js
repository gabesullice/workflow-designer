/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { encode as cborEncode } from 'cbor2';
import * as cbor2 from 'cbor2';
import {
  encodeWorkflowToUrl,
  decodeWorkflowFromUrl,
  generateShareableUrl,
  getWorkflowFromUrl,
  removeWorkflowFromUrl,
  copyToClipboard
} from './workflow-sharing.js';


describe('encodeWorkflowToUrl and decodeWorkflowFromUrl', () => {
  it('round-trip encoding/decoding works correctly', () => {
    const originalWorkflow = {
      states: [
        { id: 'draft', label: 'Draft' },
        { id: 'published', label: 'Published' }
      ],
      transitions: [
        { id: 'publish', label: 'Publish', fromStates: ['draft'], toState: 'published' }
      ],
      roles: [
        { id: 'editor', label: 'Editor', permissions: ['publish'] }
      ]
    };

    const encoded = encodeWorkflowToUrl(originalWorkflow);
    expect(encoded).toBeTruthy();
    expect(typeof encoded).toBe('string');
    
    // Should be base64url encoded (URL-safe)
    expect(encoded).not.toMatch(/[+/=]/);

    const decoded = decodeWorkflowFromUrl(encoded);
    expect(decoded).toEqual(originalWorkflow);
  });

  it('handles empty workflow', () => {
    const workflow = { states: [], transitions: [], roles: [] };
    const encoded = encodeWorkflowToUrl(workflow);
    
    // Should be base64url encoded
    expect(encoded).not.toMatch(/[+/=]/);
    
    const decoded = decodeWorkflowFromUrl(encoded);
    expect(decoded).toEqual(workflow);
  });

  it('returns null for invalid decoding input', () => {
    const result = decodeWorkflowFromUrl('invalid-base64url!');
    expect(result).toBeNull();
  });
});

describe('generateShareableUrl', () => {
  it('generates a complete URL with workflow parameter', () => {
    const workflow = { states: [], transitions: [], roles: [] };
    const baseUrl = 'https://example.com/';
    const result = generateShareableUrl(workflow, baseUrl);
    
    expect(result).toMatch(/^https:\/\/example\.com\/\?workflow=/);
    expect(result.includes('workflow=')).toBe(true);
    
    // Extract the workflow parameter value
    const url = new URL(result);
    const workflowParam = url.searchParams.get('workflow');
    
    // Should be base64url encoded (no +, /, or = characters)
    expect(workflowParam).not.toMatch(/[+/=]/);
    expect(workflowParam).not.toMatch(/%/); // Should not be URL encoded
  });

  it('preserves existing URL parameters', () => {
    const workflow = { states: [], transitions: [], roles: [] };
    const baseUrl = 'https://example.com/?existing=param';
    const result = generateShareableUrl(workflow, baseUrl);
    
    expect(result.includes('existing=param')).toBe(true);
    expect(result.includes('workflow=')).toBe(true);
    
    // Check that workflow parameter is still properly base64url encoded
    const url = new URL(result);
    const workflowParam = url.searchParams.get('workflow');
    expect(workflowParam).not.toMatch(/[+/=]/);
    expect(workflowParam).not.toMatch(/%/);
  });


  it('returns null for invalid base URL', () => {
    const workflow = { states: [], transitions: [], roles: [] };
    const result = generateShareableUrl(workflow, 'invalid-url');
    expect(result).toBeNull();
  });
});

describe('getWorkflowFromUrl', () => {
  it('extracts workflow from URL parameter', () => {
    const originalWorkflow = { states: [{ id: 'test', label: 'Test' }], transitions: [], roles: [] };
    const encoded = encodeWorkflowToUrl(originalWorkflow);
    const urlString = `https://example.com/?workflow=${encoded}`;
    
    const result = getWorkflowFromUrl(urlString);
    expect(result).toEqual(originalWorkflow);
  });

  it('returns null when no workflow parameter exists', () => {
    const urlString = 'https://example.com/?other=param';
    const result = getWorkflowFromUrl(urlString);
    expect(result).toBeNull();
  });

  it('returns null for invalid workflow parameter', () => {
    const urlString = 'https://example.com/?workflow=invalid';
    const result = getWorkflowFromUrl(urlString);
    expect(result).toBeNull();
  });

  it('handles URL with multiple parameters', () => {
    const originalWorkflow = { states: [], transitions: [], roles: [] };
    const encoded = encodeWorkflowToUrl(originalWorkflow);
    const urlString = `https://example.com/?first=param&workflow=${encoded}&last=param`;
    
    const result = getWorkflowFromUrl(urlString);
    expect(result).toEqual(originalWorkflow);
  });

  it('returns null for invalid URL', () => {
    const result = getWorkflowFromUrl('invalid-url');
    expect(result).toBeNull();
  });
});

describe('removeWorkflowFromUrl', () => {
  it('removes workflow parameter from URL', () => {
    const mockReplaceState = vi.fn();
    Object.assign(window, {
      location: { href: 'https://example.com/?workflow=abc123&other=param' },
      history: { replaceState: mockReplaceState }
    });
    
    removeWorkflowFromUrl();
    
    expect(mockReplaceState).toHaveBeenCalledWith({}, '', 'https://example.com/?other=param');
  });

  it('does nothing when no workflow parameter exists', () => {
    const mockReplaceState = vi.fn();
    Object.assign(window, {
      location: { href: 'https://example.com/?other=param' },
      history: { replaceState: mockReplaceState }
    });
    
    removeWorkflowFromUrl();
    
    expect(mockReplaceState).not.toHaveBeenCalled();
  });

  it('handles invalid URLs gracefully', () => {
    const mockReplaceState = vi.fn();
    Object.assign(window, {
      location: { href: 'invalid-url' },
      history: { replaceState: mockReplaceState }
    });
    
    // Should not throw
    expect(() => removeWorkflowFromUrl()).not.toThrow();
    expect(mockReplaceState).not.toHaveBeenCalled();
  });
});

describe('copyToClipboard', () => {
  it('uses navigator.clipboard when available', async () => {
    const mockWriteText = vi.fn().mockResolvedValue();
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText }
    });
    
    const result = await copyToClipboard('test text');
    
    expect(result).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith('test text');
  });

  it('returns false when clipboard fails', async () => {
    const mockWriteText = vi.fn().mockRejectedValue(new Error('Clipboard error'));
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText }
    });
    
    const result = await copyToClipboard('test text');
    expect(result).toBe(false);
  });

  it('handles missing navigator.clipboard', async () => {
    Object.assign(navigator, { clipboard: undefined });
    
    const result = await copyToClipboard('test text');
    expect(result).toBe(false);
  });
});