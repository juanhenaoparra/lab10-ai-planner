import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/types/chat';
import { Project, ProjectNode, ProjectEdge } from '@/types/project';
import { chatStorage } from '@/services/storage';
import { getAIResponse } from '@/services/openai';

export function useChat(
  projectId: string,
  project: Project,
  nodes: ProjectNode[],
  edges: ProjectEdge[]
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load messages from storage on mount
  useEffect(() => {
    const chatHistory = chatStorage.getProjectChat(projectId);
    setMessages(chatHistory.messages);
  }, [projectId]);

  // Save messages to storage whenever they change
  useEffect(() => {
    chatStorage.saveProjectChat(projectId, messages);
  }, [projectId, messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      try {
        setIsLoading(true);
        setError(null);

        // Add user message
        const userMessage: Message = {
          id: uuidv4(),
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, userMessage]);

        // Get AI response
        const aiResponse = await getAIResponse(
          content,
          project,
          nodes,
          edges,
          messages
        );

        // Add AI message
        const aiMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: aiResponse,
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, aiMessage]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get AI response');
      } finally {
        setIsLoading(false);
      }
    },
    [project, nodes, edges, messages]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    chatStorage.saveProjectChat(projectId, []);
  }, [projectId]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}
