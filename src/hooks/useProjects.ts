import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Project } from '@/types/project';
import { projectStorage } from '@/services/storage';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    setProjects(projectStorage.getProjects());
  }, []);

  const createProject = (data: {
    name: string;
    objective: string;
    tools: string[];
  }) => {
    const newProject: Project = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projectStorage.saveProject(newProject);
    setProjects(projectStorage.getProjects());
    return newProject;
  };

  const updateProject = (project: Project) => {
    const updatedProject = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    projectStorage.saveProject(updatedProject);
    setProjects(projectStorage.getProjects());
    return updatedProject;
  };

  const deleteProject = (id: string) => {
    projectStorage.deleteProject(id);
    setProjects(projectStorage.getProjects());
  };

  return {
    projects,
    createProject,
    updateProject,
    deleteProject,
  };
}
