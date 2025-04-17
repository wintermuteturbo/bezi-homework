interface ChatGPTResponse {
  text: string;
  error?: string;
}

// Define API message interface to match OpenAI's API
interface ApiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

const CHATGPT_API_URL = 'https://api.openai.com/v1/chat/completions';
const UNITY_CLASS_NAME = "GeneratedScene";
// Prompt template for guiding the model
// TBD: Add more details about the scene and game objects or maybe use separate C# script template file and simplify this prompt
const UNITY_PROMPT_TEMPLATE = `You are a specialized AI designed to generate Unity C# scripts.

When the user describes a scene or game objects, translate their description into valid Unity C# code.
Your output must:
- Include the \`using UnityEngine;\` namespace
- Define a public class named \`${UNITY_CLASS_NAME}\` that extends \`MonoBehaviour\`
- Contain a \`Start()\` method where the scene is constructed
- Include a static method marked with \`[RuntimeInitializeOnLoadMethod]\` to automatically create a GameObject and attach the script to it
- Build all scene elements from code — do not rely on manually placed GameObjects in the Unity Editor
- Create a root GameObject (e.g. "SceneRoot") to organize scene objects hierarchically
- Set object types, positions, colors, materials, rotations, and other components as appropriate

Here is the expected structure:

using UnityEngine;

public class ${UNITY_CLASS_NAME} : MonoBehaviour
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
    static void Init()
    {
        // Auto-create a GameObject and attach this script
        GameObject runner = new GameObject("GeneratedSceneRunner");
        runner.AddComponent<${UNITY_CLASS_NAME}>();
    }

    void Start()
    {
        GameObject sceneRoot = new GameObject("SceneRoot");

        GameObject cube = GameObject.CreatePrimitive(PrimitiveType.Cube);
        cube.transform.parent = sceneRoot.transform;
        cube.transform.position = new Vector3(0, 0, 0);
        cube.GetComponent<Renderer>().material.color = Color.red;
    }
}`;
// TOBD: add passing messages history to the prompt to mantain context of the conversation
export async function sendMessageToChatGPT(message: string, previousMessages: ApiMessage[] = []): Promise<ChatGPTResponse> {
  try {
    
    const apiUrl = CHATGPT_API_URL;
    
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      throw new Error('No API key provided. Set VITE_OPENAI_API_KEY in your environment variables.');
    }
    
    // Build messages array starting with system prompt, then previous messages, then current message
    const messagesPayload = [
      {
        role: 'system' as const,
        content: UNITY_PROMPT_TEMPLATE
      },
      ...previousMessages,
      {
        role: 'user' as const,
        content: message
      }
    ];
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o', // Using a more capable model
        messages: messagesPayload,
        max_tokens: 2000,
        temperature: 0.7 // Slightly higher creativity
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get response from ChatGPT');
    }

    const data = await response.json();
    return {
      text: data.choices[0].message.content
    };
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    return {
      text: '',
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    };
  }
}

// Helper function to validate if the response is valid Unity C# code
export function isValidUnityCode(codeString: string): boolean {
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