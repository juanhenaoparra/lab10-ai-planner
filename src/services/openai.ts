import { Message } from '@/types/chat';
import { Project, ProjectNode, ProjectEdge } from '@/types/project';

const ANTHROPIC_API_KEY = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;
const API_URL = 'https://api.anthropic.com/v1/messages';

interface AnthropicResponse {
  content: [{
    text: string;
  }];
}

export async function getAIResponse(
  message: string,
  project: Project,
  nodes: ProjectNode[],
  edges: ProjectEdge[],
  previousMessages: Message[]
): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key is not configured');
  }

  // Create system message with project context
  const systemMessage = `You are an AI project planning assistant. You are helping with a project named "${project.name}" with the objective: "${project.objective}". The project uses the following tools: ${project.tools.join(', ')}. You can see the current flow diagram structure and help the user plan and organize their project.

Current flow diagram state:
Nodes: ${JSON.stringify(nodes)}
Connections: ${JSON.stringify(edges)}`;

  // Format previous messages for Claude
  const formattedMessages = previousMessages.map(msg => ({
    role: msg.role,
    content: msg.content
  }));

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1000,
        messages: [
          {
            role: 'system',
            content: systemMessage
          },
          ...formattedMessages,
          {
            role: 'user',
            content: message
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to get response from Anthropic');
    }

    const data: AnthropicResponse = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error calling Anthropic:', error);
    throw error;
  }
}