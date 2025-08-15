import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface CustomNodeData {
  label: string;
  content: string;
}

function CustomNode({ data }: NodeProps<CustomNodeData>) {
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border border-gray-200">
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
      <div className="flex flex-col gap-2">
        <div className="flex items-center">
          <div className="text-sm font-bold text-gray-900">{data.label}</div>
        </div>
        {data.content && (
          <div className="text-xs text-gray-500">{data.content}</div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

export default memo(CustomNode);
