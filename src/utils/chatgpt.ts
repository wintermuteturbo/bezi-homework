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

// Streaming version of the ChatGPT API response
export async function streamChatGPTResponse(
  message: string, 
  previousMessages: ApiMessage[] = [],
  onChunk: (chunk: string) => void
): Promise<void> {
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
        model: 'gpt-4o',
        messages: messagesPayload,
        max_tokens: 2000,
        temperature: 0.7,
        stream: true // Enable streaming
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to get streaming response from ChatGPT');
    }

    // Process the stream
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Failed to get reader from response');

    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // Process all complete "data:" lines in the buffer
      while (buffer.includes('\n\n')) {
        const lineEnd = buffer.indexOf('\n\n');
        const line = buffer.slice(0, lineEnd).trim();
        buffer = buffer.slice(lineEnd + 2);
        
        if (line.startsWith('data: ')) {
          const dataStr = line.slice(6);
          
          // Handle end of stream
          if (dataStr === '[DONE]') {
            break;
          }
          
          try {
            const data = JSON.parse(dataStr);
            const content = data.choices[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch (e) {
            console.error('Error parsing JSON from stream:', e);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error in streaming ChatGPT API:', error);
    throw error;
  }
}