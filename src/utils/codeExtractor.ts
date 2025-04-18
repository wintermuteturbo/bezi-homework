// Helper function to validate if the response is valid Unity C# code
function isValidUnityCode(codeString: string): boolean {
  try {
    // Basic validation - check for required Unity elements
    return (
      codeString.includes('using UnityEngine') &&
      (codeString.includes('MonoBehaviour') ||
        codeString.includes('GameObject') ||
        codeString.includes('Transform'))
    );
  } catch (error) {
    return false;
  }
}
/**
 * Extracts C# code from text
 * @param text The text containing C# code
 * @returns The extracted C# code or null if none found
 */
export const extractCSharpCodeFromText = (text: string): string | null => {
  // Look for C# code between code blocks
  const csharpRegex = /```(?:csharp|cs)?\s*([\s\S]*?)```/;
  const match = text.match(csharpRegex);

  if (match && match[1]) {
    return match[1].trim();
  }

  // If no code blocks found but there's Unity C# code, return the whole text
  if (isValidUnityCode(text)) {
    return text;
  }

  return null;
};

/**
 * Extracts class name from C# code
 * @param code The C# code
 * @returns The extracted class name or null if none found
 */
export const extractClassNameFromCode = (code: string): string | null => {
  // Look for class definition
  const classRegex = /\bclass\s+(\w+)/;
  const match = code.match(classRegex);

  if (match && match[1]) {
    return match[1];
  }

  return null;
}; 