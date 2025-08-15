'use client';

import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { FlowBoard } from '@/components/flow/FlowBoard';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { Project } from '@/types/project';
import { projectStorage } from '@/services/storage';
import { useFlow } from '@/hooks/useFlow';
import { useChat } from '@/hooks/useChat';
import { useRouter } from 'next/navigation';

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
  } = useFlow(params.id);

  const {
    messages,
    isLoading,
    error,
    sendMessage,
  } = useChat(
    params.id,
    project as Project,
    nodes,
    edges
  );

  useEffect(() => {
    const loadedProject = projectStorage.getProject(params.id);
    if (!loadedProject) {
      router.push('/');
      return;
    }
    setProject(loadedProject);
  }, [params.id, router]);

  if (!project) {
    return null;
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
            <p className="text-gray-600 mt-1">{project.objective}</p>
            {project.tools.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {project.tools.map((tool, index) => (
                  <span
                    key={index}
                    className="inline-block bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Flow Board Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">Flow Board</h3>
            <div className="w-full h-[600px]">
              <FlowBoard projectId={project.id} />
            </div>
          </div>

          {/* Chat Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="text-lg font-semibold mb-4">AI Assistant</h3>
            <div className="h-[600px]">
              <ChatInterface
                messages={messages}
                onSendMessage={sendMessage}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}