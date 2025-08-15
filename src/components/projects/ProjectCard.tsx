import { Project } from '@/types/project';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
        <button
          onClick={() => onDelete(project.id)}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          ×
        </button>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{project.objective}</p>
      
      {project.tools.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-1">Tools:</p>
          <div className="flex flex-wrap gap-1">
            {project.tools.map((tool, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href={`/project/${project.id}`}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          Open Project →
        </Link>
      </div>
    </div>
  );
}
