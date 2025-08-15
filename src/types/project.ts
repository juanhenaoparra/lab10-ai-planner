export interface Project {
  id: string;
  name: string;
  objective: string;
  tools: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label: string;
    content: string;
  };
}

export interface ProjectEdge {
  id: string;
  source: string;
  target: string;
}
