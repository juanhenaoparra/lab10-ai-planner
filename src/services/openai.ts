import { Message } from '@/types/chat';
import { Project, ProjectNode, ProjectEdge } from '@/types/project';

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const API_URL = 'https://api.openai.com/v1/chat/completions';

interface ChatCompletionResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export async function getAIResponse(
  message: string,
  project: Project,
  nodes: ProjectNode[],
  edges: ProjectEdge[],
  previousMessages: Message[]
): Promise<string> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  // Create system message with project context
  const systemMessage = {
    role: 'system',
    content: `You are an AI project planning assistant. You are helping with a project named "${project.name}" with the objective: "${project.objective}". The project uses the following tools: ${project.tools.join(', ')}. You can see the current flow diagram structure and help the user plan and organize their project.`
  };

  // Create messages array with context
  const messages = [
    systemMessage,
    // Add flow diagram context
    {
      role: 'system',
      content: `Current flow diagram state:\nNodes: ${JSON.stringify(nodes)}\nConnections: ${JSON.stringify(edges)}`
    },
    // Add previous messages for context
    ...previousMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    })),
    // Add the new user message
    {
      role: 'user',
      content: message
    }
  ];

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4.1',
        messages,
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from OpenAI');
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw error;
  }
}
