/**
 * Workflow Sharing Utilities
 * 
 * Handles encoding/decoding workflows for URL sharing:
 * 1. CBOR workflow → base64url encoding for URL safety
 */

import * as urlSafeBase64 from 'url-safe-base64';
import { encode as cborEncode, decode as cborDecode } from 'cbor2';

/**
 * Encodes a workflow object to a URL parameter value
 * @param {Object} workflow - Workflow object with states, transitions, roles
 * @returns {string|null} Base64url encoded string for URL parameter
 */
export function encodeWorkflowToUrl(workflow) {
  try {
    const cborBuffer = cborEncode(workflow);
    const base64Cbor = btoa(String.fromCharCode(...cborBuffer));
    const urlSafeBase64Cbor = urlSafeBase64.encode(base64Cbor);
    return urlSafeBase64.trim(urlSafeBase64Cbor);
  } catch (error) {
    return null;
  }
}

/**
 * Decodes a workflow object from a URL parameter value
 * @param {string} base64urlString - Base64url encoded string from URL parameter
 * @returns {Object|null} Workflow object or null if invalid
 */
export function decodeWorkflowFromUrl(base64urlString) {
  try {
    // Convert URL-safe base64 back to standard base64, then decode
    const base64Cbor = urlSafeBase64.decode(base64urlString);
    // Add padding back if needed for atob()
    const paddedBase64Cbor = base64Cbor + '='.repeat((4 - base64Cbor.length % 4) % 4);
    const cborString = atob(paddedBase64Cbor);
    const cborBuffer = new Uint8Array(cborString.split('').map(char => char.charCodeAt(0)));
    const workflow = cborDecode(cborBuffer);
    
    // Validate workflow structure
    if (!workflow || typeof workflow !== 'object') {
      return null;
    }
    
    // Ensure required arrays exist
    return {
      states: Array.isArray(workflow.states) ? workflow.states : [],
      transitions: Array.isArray(workflow.transitions) ? workflow.transitions : [],
      roles: Array.isArray(workflow.roles) ? workflow.roles : []
    };
  } catch (error) {
    return null;
  }
}

/**
 * Generates a complete shareable URL with the workflow
 * @param {Object} workflow - Workflow object with states, transitions, roles
 * @param {string} baseUrl - Base URL to add workflow parameter to (defaults to current location)
 * @returns {string|null} Complete URL with workflow parameter
 */
export function generateShareableUrl(workflow, baseUrl = window.location.href) {
  try {
    const encodedWorkflow = encodeWorkflowToUrl(workflow);
    if (!encodedWorkflow) {
      return null;
    }
    
    const url = new URL(baseUrl);
    url.searchParams.set('workflow', encodedWorkflow);
    return url.toString();
  } catch (error) {
    return null;
  }
}

/**
 * Extracts workflow from URL string
 * @param {string} urlString - URL string to extract workflow from (defaults to current location)
 * @returns {Object|null} Workflow object from URL or null if not found
 */
export function getWorkflowFromUrl(urlString = window.location.href) {
  try {
    const url = new URL(urlString);
    const workflowParam = url.searchParams.get('workflow');
    
    if (!workflowParam) {
      return null;
    }
    
    return decodeWorkflowFromUrl(workflowParam);
  } catch (error) {
    return null;
  }
}

/**
 * Removes the workflow parameter from the current URL
 */
export function removeWorkflowFromUrl() {
  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has('workflow')) {
      url.searchParams.delete('workflow');
      window.history.replaceState({}, '', url.toString());
    }
  } catch (error) {
    // Ignore errors in URL manipulation
  }
}

/**
 * Copies text to clipboard
 * @param {string} text - Text to copy to clipboard
 * @returns {Promise<boolean>} Promise resolving to success status
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
}