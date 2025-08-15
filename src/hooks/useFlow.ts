import { useState, useCallback, useEffect } from 'react';
import { Node, Edge, addEdge, Connection, useNodesState, useEdgesState } from 'reactflow';
import { v4 as uuidv4 } from 'uuid';
import { projectStorage } from '@/services/storage';
import { ProjectNode, ProjectEdge } from '@/types/project';

export function useFlow(projectId: string) {
  // Convert ProjectNode to ReactFlow Node
  const projectNodesToFlowNodes = (nodes: ProjectNode[]): Node[] => {
    return nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    }));
  };

  // Convert ProjectEdge to ReactFlow Edge
  const projectEdgesToFlowEdges = (edges: ProjectEdge[]): Edge[] => {
    return edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    }));
  };

  // Initialize nodes and edges from storage
  const initialNodes = projectNodesToFlowNodes(projectStorage.getProjectNodes(projectId));
  const initialEdges = projectEdgesToFlowEdges(projectStorage.getProjectEdges(projectId));

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Save nodes and edges when they change
  useEffect(() => {
    const projectNodes: ProjectNode[] = nodes.map((node) => ({
      id: node.id,
      type: node.type || 'custom',
      position: node.position,
      data: node.data,
    }));
    projectStorage.saveProjectNodes(projectId, projectNodes);
  }, [nodes, projectId]);

  useEffect(() => {
    const projectEdges: ProjectEdge[] = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
    }));
    projectStorage.saveProjectEdges(projectId, projectEdges);
  }, [edges, projectId]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, id: uuidv4() }, eds));
    },
    [setEdges]
  );

  const addNode = useCallback(
    (label: string, content: string) => {
      const newNode: Node = {
        id: uuidv4(),
        type: 'custom',
        position: {
          x: Math.random() * 500,
          y: Math.random() * 500,
        },
        data: { label, content },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  return {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
  };
}
