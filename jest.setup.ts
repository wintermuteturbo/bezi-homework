// Add custom jest matchers for asserting on DOM nodes
import '@testing-library/jest-dom';
import { jest, beforeEach } from '@jest/globals';

// Fix for matchMedia not available in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Reset any mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
}); 