import { Project, ProjectNode, ProjectEdge } from '@/types/project';
import { Message, ChatHistory } from '@/types/chat';

const PROJECTS_KEY = 'ai_planner_projects';
const NODES_KEY = 'ai_planner_nodes';
const EDGES_KEY = 'ai_planner_edges';
const CHAT_KEY = 'ai_planner_chat';

// Project Storage
export const projectStorage = {
  getProjects: (): Project[] => {
    if (typeof window === 'undefined') return [];
    const projects = localStorage.getItem(PROJECTS_KEY);
    return projects ? JSON.parse(projects) : [];
  },

  getProject: (id: string): Project | null => {
    const projects = projectStorage.getProjects();
    return projects.find(p => p.id === id) || null;
  },

  saveProject: (project: Project): void => {
    const projects = projectStorage.getProjects();
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  },

  deleteProject: (id: string): void => {
    const projects = projectStorage.getProjects();
    localStorage.setItem(
      PROJECTS_KEY,
      JSON.stringify(projects.filter(p => p.id !== id))
    );
    // Clean up associated data
    projectStorage.deleteProjectNodes(id);
    projectStorage.deleteProjectEdges(id);
    chatStorage.deleteProjectChat(id);
  },

  // Flow Nodes Storage
  getProjectNodes: (projectId: string): ProjectNode[] => {
    if (typeof window === 'undefined') return [];
    const nodesKey = `${NODES_KEY}_${projectId}`;
    const nodes = localStorage.getItem(nodesKey);
    return nodes ? JSON.parse(nodes) : [];
  },

  saveProjectNodes: (projectId: string, nodes: ProjectNode[]): void => {
    const nodesKey = `${NODES_KEY}_${projectId}`;
    localStorage.setItem(nodesKey, JSON.stringify(nodes));
  },

  deleteProjectNodes: (projectId: string): void => {
    const nodesKey = `${NODES_KEY}_${projectId}`;
    localStorage.removeItem(nodesKey);
  },

  // Flow Edges Storage
  getProjectEdges: (projectId: string): ProjectEdge[] => {
    if (typeof window === 'undefined') return [];
    const edgesKey = `${EDGES_KEY}_${projectId}`;
    const edges = localStorage.getItem(edgesKey);
    return edges ? JSON.parse(edges) : [];
  },

  saveProjectEdges: (projectId: string, edges: ProjectEdge[]): void => {
    const edgesKey = `${EDGES_KEY}_${projectId}`;
    localStorage.setItem(edgesKey, JSON.stringify(edges));
  },

  deleteProjectEdges: (projectId: string): void => {
    const edgesKey = `${EDGES_KEY}_${projectId}`;
    localStorage.removeItem(edgesKey);
  }
};

// Chat Storage
export const chatStorage = {
  getProjectChat: (projectId: string): ChatHistory => {
    if (typeof window === 'undefined') return { projectId, messages: [] };
    const chatKey = `${CHAT_KEY}_${projectId}`;
    const chat = localStorage.getItem(chatKey);
    return chat ? JSON.parse(chat) : { projectId, messages: [] };
  },

  saveProjectChat: (projectId: string, messages: Message[]): void => {
    const chatKey = `${CHAT_KEY}_${projectId}`;
    localStorage.setItem(chatKey, JSON.stringify({ projectId, messages }));
  },

  deleteProjectChat: (projectId: string): void => {
    const chatKey = `${CHAT_KEY}_${projectId}`;
    localStorage.removeItem(chatKey);
  }
};