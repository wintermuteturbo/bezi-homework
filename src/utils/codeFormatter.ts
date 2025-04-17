import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

/**
 * Formats code blocks in a message text using highlight.js
 * @param text The text containing potential code blocks
 * @returns An array of regular text and highlighted code blocks to be rendered
 */
export const formatCodeInText = (text: string): { type: 'text' | 'code'; content: string; language?: string }[] => {
    // If text is empty, return empty array
    if (!text) return [];

    // Regex to match code blocks
    const codeBlockRegex = /```(?:([\w-]+)\n)?([\s\S]*?)```/g;

    const result: { type: 'text' | 'code'; content: string; language?: string }[] = [];
    let lastIndex = 0;
    let match;

    // Find all code blocks
    while ((match = codeBlockRegex.exec(text)) !== null) {
        const [fullMatch, language, code] = match;
        const matchIndex = match.index;

        // Add text before code block
        if (matchIndex > lastIndex) {
            result.push({
                type: 'text',
                content: text.substring(lastIndex, matchIndex).trim()
            });
        }

        // Default to C# for Unity if language not specified
        const codeLanguage = language || 'csharp';

        // Highlight as C# (prioritize C# for Unity code)
        let highlightedCode: string;
        try {
            highlightedCode = hljs.highlight(code.trim(), { language: codeLanguage }).value;
        } catch (err) {
            highlightedCode = hljs.highlightAuto(code.trim()).value;
        }

        result.push({
            type: 'code',
            content: highlightedCode,
            language: codeLanguage
        });

        lastIndex = matchIndex + fullMatch.length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        result.push({
            type: 'text',
            content: text.substring(lastIndex)
        });
    }

    return result;
};