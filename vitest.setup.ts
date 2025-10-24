import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, expect, vi } from 'vitest';
import 'vitest-axe/extend-expect';
import * as matchers from 'vitest-axe/matchers';

expect.extend(matchers);

afterEach(() => {
  cleanup();
});

// Mock DOM APIs not implemented in jsdom
if (typeof Element.prototype.scrollIntoView === 'undefined') {
  Element.prototype.scrollIntoView = vi.fn();
}

if (typeof HTMLCanvasElement.prototype.getContext === 'undefined') {
  HTMLCanvasElement.prototype.getContext = vi.fn(() => null);
}

// Suppress specific console errors from jsdom/axe-core
beforeAll(() => {
  const originalError = console.error;
  vi.spyOn(console, 'error').mockImplementation((...args) => {
    const message = args[0]?.toString() || '';

    // Suppress HTMLCanvasElement warnings from axe-core
    if (message.includes('Not implemented: HTMLCanvasElement')) {
      return;
    }

    // Let other errors through
    originalError(...args);
  });
});
