import { useState } from 'react';

interface CreateProjectFormProps {
  onSubmit: (data: {
    name: string;
    objective: string;
    tools: string[];
  }) => void;
  onCancel: () => void;
}

export function CreateProjectForm({ onSubmit, onCancel }: CreateProjectFormProps) {
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [toolInput, setToolInput] = useState('');
  const [tools, setTools] = useState<string[]>([]);

  const handleAddTool = () => {
    if (toolInput.trim()) {
      setTools([...tools, toolInput.trim()]);
      setToolInput('');
    }
  };

  const handleRemoveTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      objective,
      tools,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Project Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="objective" className="block text-sm font-medium text-gray-700">
          Objective
        </label>
        <textarea
          id="objective"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="tools" className="block text-sm font-medium text-gray-700">
          Tools
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            id="tools"
            value={toolInput}
            onChange={(e) => setToolInput(e.target.value)}
            className="block flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Add a tool"
          />
          <button
            type="button"
            onClick={handleAddTool}
            className="bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
          >
            Add
          </button>
        </div>
        {tools.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tools.map((tool, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
              >
                {tool}
                <button
                  type="button"
                  onClick={() => handleRemoveTool(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Project
        </button>
      </div>
    </form>
  );
}
