import { jest } from '@jest/globals';

export const generateId = jest.fn(() => 'mock-id');

export const streamChatGPTResponse = jest.fn(
    (_message: string, _apiMessages: Array<{ role: string, content: string }>, onChunkReceived: (chunk: string) => void) => {
        // Simulate streaming by calling the callback with a mock response
        onChunkReceived('Mock response');
        return Promise.resolve();
    }
); 