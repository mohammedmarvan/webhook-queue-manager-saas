import { PageHeader } from '@/components/layout/PageHeader';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { CommonTable } from '@/components/common/common-table';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useMemo } from 'react';
import { updateSource, createSource, deleteSource } from '@/api/source';
import { AppToast } from '@/components/layout/AppToast';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { type Source } from '@/types/models';
import { type Column } from '@/components/common/common-table';
import { SourceModal } from '@/components/source/SourceModal';
import { Badge } from '@/components/ui/badge';
import { AxiosError } from 'axios';

export default function SourcePage() {
  // Memoize columns to prevent unnecessary re-renders
  const columns: Column<Source>[] = useMemo(
    () => [
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
    ],
    []
  );

  // Consolidated state management
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | string | null | undefined;
    name: string;
  }>({ open: false, id: null, name: '' });
  const [sourceModal, setSourceModal] = useState<{
    open: boolean;
    editingSource: Source | null;
    loading: boolean;
  }>({ open: false, editingSource: null, loading: false });

  // Optimized event handlers with useCallback
  const handleDelete = useCallback(async () => {
    if (!deleteDialog.id) return;

    try {
      setSourceModal((prev) => ({ ...prev, loading: true }));
      await deleteSource(deleteDialog.id);
      AppToast.success(`Source "${deleteDialog.name}" deleted successfully`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error deleting source:', err);
      const axiosErr = err as AxiosError<{ message?: string }>;
      const serverMessage = axiosErr.response?.data?.message;
      AppToast.error(
        serverMessage ?? 'Failed to delete source. Please try again.'
      );
    } finally {
      setSourceModal((prev) => ({ ...prev, loading: false }));
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  }, [deleteDialog.id, deleteDialog.name]);

  const handleEditSourceClick = useCallback((sourceData: Source) => {
    setSourceModal({
      open: true,
      editingSource: sourceData,
      loading: false,
    });
  }, []);

  const handleAddSource = useCallback(() => {
    setSourceModal({
      open: true,
      editingSource: null,
      loading: false,
    });
  }, []);

  // Helper function to prepare source data
  const prepareSourceData = useCallback((sourceData: Source) => {
    const baseData = {
      name: sourceData.name,
      projectId: sourceData.projectId,
      token: sourceData.token,
      urlPath: sourceData.urlPath,
      status: sourceData.status,
    };

    return sourceData.id ? { ...baseData, id: sourceData.id } : baseData;
  }, []);

  const handleCreateSource = useCallback(
    async (sourceData: Source) => {
      try {
        setSourceModal((prev) => ({ ...prev, loading: true }));

        const data = prepareSourceData(sourceData);
        const res = sourceData.id
          ? await updateSource(data as Source)
          : await createSource(data);

        if (res?.status) {
          const action = sourceData.id ? 'updated' : 'created';
          AppToast.success(`Source ${action} successfully`);
          setRefreshKey((k) => k + 1);
          setSourceModal({ open: false, editingSource: null, loading: false });
        } else {
          AppToast.error(
            res?.message ??
              `Failed to ${sourceData.id ? 'update' : 'create'} source. Please try again.`
          );
        }
      } catch (err) {
        console.error('Error saving source:', err);
        const axiosErr = err as AxiosError<{ message?: string }>;
        const serverMessage = axiosErr.response?.data?.message;
        AppToast.error(
          serverMessage ?? 'Failed to save source. Please try again.'
        );
      } finally {
        setSourceModal((prev) => ({ ...prev, loading: false }));
      }
    },
    [prepareSourceData]
  );

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
              aria-label={`Edit source ${row.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setDeleteDialog({
                  open: true,
                  id: row.id,
                  name: row.name,
                });
              }}
              aria-label={`Delete source ${row.name}`}
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
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        title="Delete Source"
        description="Are you sure you want to delete this source? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
      />

      <SourceModal
        open={sourceModal.open}
        initialData={sourceModal.editingSource || undefined}
        onClose={() => setSourceModal((prev) => ({ ...prev, open: false }))}
        onSave={(data) => handleCreateSource(data as Source)}
        loading={sourceModal.loading}
        disableProjectId={false}
      />
    </div>
  );
}
