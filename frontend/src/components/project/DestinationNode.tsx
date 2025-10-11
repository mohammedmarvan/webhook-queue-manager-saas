import { Handle, Position } from '@xyflow/react';

interface DestinationNodeProps {
  data: {
    id: string;
    name: string;
    url: string;
    status?: string;
    projectId?: string;
    secret?: string;
    timeoutMs?: number;
    onClick: (data: DestinationNodeProps['data']) => void;
  };
}

export const DestinationNode: React.FC<DestinationNodeProps> = ({ data }) => {
  const statusColor =
    data.status?.toLowerCase() === 'active'
      ? 'bg-green-500'
      : data.status?.toLowerCase() === 'disabled'
        ? 'bg-red-500'
        : 'bg-gray-400';

  return (
    <div
      onClick={() => data.onClick?.(data)}
      className="rounded-lg border border-gray-300 bg-white p-3 shadow-md w-56 text-xs hover:shadow-lg cursor-pointer transition"
    >
      <div className="font-semibold text-gray-800 text-sm text-center">
        {data.name}
      </div>
      <div className="text-gray-500 mt-1">Destination ID: {data.id}</div>
      <div className="text-blue-500 mt-1 truncate">URL Path: {data.url}</div>

      <div
        className={`mt-2 inline-block text-white px-2 py-0.5 rounded-full text-[10px] ${statusColor}`}
      >
        {data.status}
      </div>
      {/* Input handle */}
      <Handle type="target" position={Position.Left} />
    </div>
  );
};
