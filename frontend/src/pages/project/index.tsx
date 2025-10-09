import { PageHeader } from '@/components/layout/PageHeader';
import { Pencil, Trash2 } from 'lucide-react';
import { CommonTable } from '@/components/common/common-table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { deleteProject } from '@/api/project';
import { AppToast } from '@/components/layout/AppToast';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { type Project } from '@/types/models';

export default function Project() {
  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'createdAt', label: 'Created At' },
  ];
  const [refreshKey, setRefreshKey] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string | null>(null);
  const [deleteName, setDeleteName] = useState<string>('');

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProject(deleteId);
      AppToast.success(`Project "${deleteName}" deleted successfully`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.log('Error in deleting project ', err);
      AppToast.error(`Error in deleting project.`);
    } finally {
      setOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6">
      <PageHeader
        breadcrumb={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Projects' },
        ]}
      />
      <CommonTable<Project>
        endpoint="/projects"
        columns={columns}
        searchPlaceholder="Search projects..."
        refreshKey={refreshKey}
        renderActions={(row) => (
          <div className="space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => console.log('Edit', row.id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setDeleteId(row.id);
                setDeleteName(row.name);
                setOpen(true);
              }}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
      />

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
      />
    </div>
  );
}
