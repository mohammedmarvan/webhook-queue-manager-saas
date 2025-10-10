import { Handle, Position } from '@xyflow/react';

interface ProjectNodeProps {
  data: {
    id: string;
    name: string;
    onClick?: (data: ProjectNodeProps['data']) => void;
    description?: string;
    retentionDays?: number;
  };
}

export const ProjectNode: React.FC<ProjectNodeProps> = ({ data }) => {
  return (
    <div
      onClick={() => data.onClick?.(data)}
      className="rounded-lg border border-gray-300 bg-white shadow-md px-4 py-2 w-64 text-sm"
    >
      <div className="font-semibold text-gray-800 text-center py-2">
        {data.name}
      </div>
      <div className="text-gray-500 text-xs">Project ID: {data.id}</div>

      {/* Handles on both sides */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
