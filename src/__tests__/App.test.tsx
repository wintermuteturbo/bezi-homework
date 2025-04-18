import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock the utility functions
jest.mock('../utils/chatgpt', () => ({
    streamChatGPTResponse: jest.fn((_message: string, _apiMessages: any, onChunkReceived: (chunk: string) => void) => {
        onChunkReceived('Mock AI response');
        return Promise.resolve();
    }),
}));

jest.mock('../utils/helpers', () => ({
    generateId: jest.fn(() => 'mock-id'),
}));

// Mock the Toaster component that's causing the matchMedia error
jest.mock('../components/ui/sonner', () => ({
    Toaster: () => null,
}));

// Mock the child components
jest.mock('../components/ChatDisplay', () => ({
    __esModule: true,
    default: ({ messages }: { messages: any[], isLoading: boolean }) => (
        <div data-testid="chat-display">
            {messages.map(msg => (
                <div key={msg.id} data-testid={`message-${msg.role}`}>
                    {msg.text}
                </div>
            ))}
        </div>
    ),
}));

jest.mock('../components/ChatInputCard', () => ({
    __esModule: true,
    default: ({
        handleChatSubmit,
        inputValue,
        onInputChange
    }: {
        handleChatSubmit: (message: string) => void,
        isLoading: boolean,
        inputValue: string,
        onInputChange: (value: string) => void,
        handleStartNewChat: () => void
    }) => (
        <div data-testid="chat-input">
            <input
                data-testid="chat-input-field"
                value={inputValue}
                onChange={(e) => onInputChange(e.target.value)}
            />
            <button
                data-testid="submit-button"
                onClick={() => handleChatSubmit(inputValue)}
            >
                Submit
            </button>
        </div>
    ),
}));

jest.mock('../components/EmptyState', () => ({
    __esModule: true,
    default: ({ onSelectPrompt }: { onSelectPrompt: (prompt: string) => void }) => (
        <div data-testid="empty-state">
            <button
                data-testid="example-prompt"
                onClick={() => onSelectPrompt('Example prompt')}
            >
                Try Example
            </button>
        </div>
    ),
}));

// Mock tooltip provider
jest.mock('@/components/ui/tooltip', () => ({
    TooltipProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders empty state when no messages', () => {
        render(<App />);
        // @ts-ignore -- testing-library matchers
        expect(screen.getByTestId('empty-state')).toBeInTheDocument();
        // @ts-ignore -- testing-library matchers
        expect(screen.queryByTestId('chat-display')).not.toBeInTheDocument();
    });

    test('handles user input and displays messages', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Find and interact with the input field
        const inputField = screen.getByTestId('chat-input-field');
        await user.type(inputField, 'Hello AI');

        // Submit the message
        const submitButton = screen.getByTestId('submit-button');
        await user.click(submitButton);

        // Verify the messages are displayed
        await waitFor(() => {
            // @ts-ignore -- testing-library matchers
            expect(screen.getByTestId('message-user')).toHaveTextContent('Hello AI');
            // @ts-ignore -- testing-library matchers
            expect(screen.getByTestId('message-assistant')).toHaveTextContent('Mock AI response');
        });
    });

    test('selects an example prompt from empty state', async () => {
        const user = userEvent.setup();
        render(<App />);

        // Find and click an example prompt
        const examplePrompt = screen.getByTestId('example-prompt');
        await user.click(examplePrompt);

        // Verify that the prompt is submitted and a response is shown
        await waitFor(() => {
            // @ts-ignore -- testing-library matchers
            expect(screen.getByTestId('message-user')).toHaveTextContent('Example prompt');
            // @ts-ignore -- testing-library matchers
            expect(screen.getByTestId('message-assistant')).toHaveTextContent('Mock AI response');
        });
    });
}); 