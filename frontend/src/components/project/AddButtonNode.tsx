import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddButtonNodeProps {
  data: {
    label: string;
    onClick: () => void;
  };
}

export const AddButtonNode: React.FC<AddButtonNodeProps> = ({ data }) => {
  return (
    <div className="rounded-lg border border-dashed border-gray-300 bg-white p-3 shadow-sm w-56 flex flex-col items-center justify-center text-xs">
      <Button
        variant="outline"
        size="sm"
        onClick={data.onClick}
        className="flex items-center gap-1"
      >
        <Plus className="h-4 w-4" />
        {data.label}
      </Button>
    </div>
  );
};
