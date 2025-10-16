import { PageHeader } from '@/components/layout/PageHeader';
import { Pencil, Trash2 } from 'lucide-react';
import { CommonTable } from '@/components/common/common-table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { updateSource, createSource, deleteSource } from '@/api/source';
import { AppToast } from '@/components/layout/AppToast';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { type Source } from '@/types/models';
import { type Column } from '@/components/common/common-table';
import { Plus } from 'lucide-react';
import { SourceModal } from '@/components/source/SourceModal';
import { Badge } from '@/components/ui/badge';
import { AxiosError } from 'axios';

export default function SourcePage() {
  const columns: Column<Source>[] = [
    { key: 'name', label: 'Name' },
    { key: 'urlPath', label: 'URL Path' },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <Badge
          variant={row.status === 'active' ? 'default' : 'secondary'}
          className="capitalize"
        >
          {row.status}
        </Badge>
      ),
    },
    { key: 'projectName', label: 'Project Name' },
  ];
  const [refreshKey, setRefreshKey] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string | null | undefined>(
    null
  );
  const [deleteName, setDeleteName] = useState<string>('');
  const [openSourceModal, setOpenSourceModal] = useState(false);
  const [editingSource, setEditingSource] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setLoading(true);
      await deleteSource(deleteId);
      AppToast.success(`Source "${deleteName}" deleted successfully`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.log('Error in deleting source ', err);
      AppToast.error(`Error in deleting source.`);
    } finally {
      setLoading(false);
      setOpen(false);
      setDeleteId(null);
    }
  };

  const handleEditSourceClick = async (sourData: Source) => {
    setEditingSource(sourData);
    setOpenSourceModal(true);
  };

  const handleAddSource = async () => {
    setEditingSource({});
    setOpenSourceModal(true);
  };

  const handleCreateSource = async (sourceData: Source) => {
    try {
      setLoading(true);
      if (sourceData.id) {
        const data = {
          name: sourceData.name,
          projectId: sourceData.projectId,
          token: sourceData.token,
          urlPath: sourceData.urlPath,
          status: sourceData.status,
          id: sourceData.id,
        };
        const res = await updateSource(data);
        if (res?.status) {
          AppToast.success(`Source updated successfully`);
          setRefreshKey((k) => k + 1);
        } else {
          AppToast.error(
            res?.message ?? 'Something went wrong while updating source'
          );
        }
      } else {
        const data = {
          name: sourceData.name,
          projectId: sourceData.projectId,
          token: sourceData.token,
          urlPath: sourceData.urlPath,
          status: sourceData.status,
        };
        const res = await createSource(data);

        if (res?.status) {
          AppToast.success(`Source created successfully`);
          setRefreshKey((k) => k + 1);
        } else {
          AppToast.error(
            res?.message ?? 'Something went wrong in creating source'
          );
        }
      }
      setOpenSourceModal(false);
    } catch (err) {
      console.log(`Error in creating source `,err);
      const axiosErr = err as AxiosError<{ message?: string }>;
      const serverMessage = axiosErr.response?.data?.message;
      AppToast.error(
        serverMessage ?? 'Something went wrong in creating source'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6">
      <PageHeader
        breadcrumb={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Sources' },
        ]}
      />
      <CommonTable<Source>
        endpoint="/sources"
        columns={columns}
        searchPlaceholder="Search source here..."
        refreshKey={refreshKey}
        renderActions={(row) => (
          <div className="space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditSourceClick(row)}
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
        headerActions={
          <Button
            variant="outline"
            aria-label="Add new source"
            size="lg"
            onClick={handleAddSource}
          >
            <Plus className="h-4 w-4" />
            <span>Add New Source</span>
          </Button>
        }
      />

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete Source"
        description="Are you sure you want to delete this source? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
      />

      <SourceModal
        open={openSourceModal}
        initialData={editingSource}
        onClose={() => setOpenSourceModal(false)}
        onSave={(data) => handleCreateSource(data as Source)}
        loading={loading}
        disableProjectId={false}
      />
    </div>
  );
}
