import { Handle, Position } from '@xyflow/react';

interface SourceNodeProps {
  data: {
    id: string;
    name: string;
    urlPath: string;
    status: string;
    onClick?: (data: SourceNodeProps['data']) => void;
  };
}

export const SourceNode: React.FC<SourceNodeProps> = ({ data }) => {
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
      <div className="text-gray-500 mt-1">Source ID: {data.id}</div>
      <div className="text-blue-500 mt-1 truncate">
        URL Path: {data.urlPath}
      </div>
      <div
        className={`mt-2 inline-block text-white px-2 py-0.5 rounded-full text-[10px] ${statusColor}`}
      >
        {data.status}
      </div>

      {/* Output handle */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
};
