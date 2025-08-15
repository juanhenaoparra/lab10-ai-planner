'use client';

import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Panel,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useFlow } from '@/hooks/useFlow';
import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

interface FlowBoardProps {
  projectId: string;
}

export function FlowBoard({ projectId }: FlowBoardProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    deleteNode,
  } = useFlow(projectId);

  const [nodeName, setNodeName] = useState('');
  const [nodeContent, setNodeContent] = useState('');

  const handleAddNode = useCallback(() => {
    if (nodeName.trim()) {
      addNode(nodeName.trim(), nodeContent.trim());
      setNodeName('');
      setNodeContent('');
    }
  }, [nodeName, nodeContent, addNode]);

  return (
    <ReactFlowProvider>
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-50"
        >
          <Background />
          <Controls />
          
          <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-md space-y-4">
            <div className="space-y-2">
              <input
                type="text"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                placeholder="Node name"
                className="w-full px-3 py-2 border rounded-md"
              />
              <textarea
                value={nodeContent}
                onChange={(e) => setNodeContent(e.target.value)}
                placeholder="Node content (optional)"
                className="w-full px-3 py-2 border rounded-md"
                rows={3}
              />
              <button
                onClick={handleAddNode}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Node
              </button>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>• Drag to move nodes</p>
              <p>• Connect nodes by dragging between handles</p>
              <p>• Delete nodes by selecting and pressing delete</p>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}
