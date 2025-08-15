'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { CreateProjectForm } from '@/components/projects/CreateProjectForm';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Modal } from '@/components/shared/Modal';
import { useProjects } from '@/hooks/useProjects';

export default function Home() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { projects, createProject, deleteProject } = useProjects();

  const handleCreateProject = (data: { name: string; objective: string; tools: string[] }) => {
    createProject(data);
    setIsCreateModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">My Projects</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Create New Project
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length === 0 ? (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <p className="text-sm text-gray-500">No projects yet. Create your first project!</p>
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={deleteProject}
              />
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Project"
      >
        <CreateProjectForm
          onSubmit={handleCreateProject}
          onCancel={() => setIsCreateModalOpen(false)}
        />
      </Modal>
    </MainLayout>
  );
}