import { PageHeader } from '@/components/layout/PageHeader';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { CommonTable } from '@/components/common/common-table';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useMemo } from 'react';
import {
  deleteDestination,
  updateDestination,
  createDestination,
} from '@/api/destination';
import { AppToast } from '@/components/layout/AppToast';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { type Column } from '@/components/common/common-table';
import { Badge } from '@/components/ui/badge';
import { type Destination } from '@/types/models';
import { DestinationModal } from '@/components/destination/DestinationEditModal';
import type { DestinationData } from '@/types/destination';
import { AxiosError } from 'axios';

export default function DestinationPage() {
  // Memoize columns to prevent unnecessary re-renders
  const columns: Column<Destination>[] = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'url', label: 'URL Path' },
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
      { key: 'timeoutMs', label: 'Timeout Ms' },
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
  const [destinationModal, setDestinationModal] = useState<{
    open: boolean;
    editingDest: DestinationData | null;
    loading: boolean;
  }>({ open: false, editingDest: null, loading: false });

  // Optimized event handlers with useCallback
  const handleDelete = useCallback(async () => {
    if (!deleteDialog.id) return;

    try {
      setDestinationModal((prev) => ({ ...prev, loading: true }));
      await deleteDestination(deleteDialog.id);
      AppToast.success(
        `Destination "${deleteDialog.name}" deleted successfully`
      );
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error deleting destination:', err);
      const axiosErr = err as AxiosError<{ message?: string }>;
      const serverMessage = axiosErr.response?.data?.message;
      AppToast.error(
        serverMessage ?? 'Failed to delete destination. Please try again.'
      );
    } finally {
      setDestinationModal((prev) => ({ ...prev, loading: false }));
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  }, [deleteDialog.id, deleteDialog.name]);

  const handleEditDestClick = useCallback((destData: DestinationData) => {
    setDestinationModal({
      open: true,
      editingDest: destData,
      loading: false,
    });
  }, []);

  const handleAddDest = useCallback(() => {
    setDestinationModal({
      open: true,
      editingDest: null,
      loading: false,
    });
  }, []);

  // Helper function to prepare destination data
  const prepareDestinationData = useCallback((destData: Destination) => {
    const baseData = {
      name: destData.name,
      projectId: destData.projectId,
      url: destData.url,
      status: destData.status,
      secret: destData.secret,
      retryPolicy: destData.retryPolicy,
      timeoutMs: destData.timeoutMs,
    };

    return destData.id ? { ...baseData, id: destData.id } : baseData;
  }, []);

  const handleCreateDest = useCallback(
    async (destData: Destination) => {
      try {
        setDestinationModal((prev) => ({ ...prev, loading: true }));

        const data = prepareDestinationData(destData);
        const res = destData.id
          ? await updateDestination(data as Destination)
          : await createDestination(data);

        if (res?.status) {
          const action = destData.id ? 'updated' : 'created';
          AppToast.success(`Destination ${action} successfully`);
          setRefreshKey((k) => k + 1);
          setDestinationModal({
            open: false,
            editingDest: null,
            loading: false,
          });
        } else {
          AppToast.error(
            res?.message ??
              `Failed to ${destData.id ? 'update' : 'create'} destination. Please try again.`
          );
        }
      } catch (err) {
        console.error('Error saving destination:', err);
        const axiosErr = err as AxiosError<{ message?: string }>;
        const serverMessage = axiosErr.response?.data?.message;
        AppToast.error(
          serverMessage ?? 'Failed to save destination. Please try again.'
        );
      } finally {
        setDestinationModal((prev) => ({ ...prev, loading: false }));
      }
    },
    [prepareDestinationData]
  );

  return (
    <div className="flex flex-col gap-4 py-4 px-4 md:gap-6 md:py-6">
      <PageHeader
        breadcrumb={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Destinations' },
        ]}
      />
      <CommonTable<Destination>
        endpoint="/destinations"
        columns={columns}
        searchPlaceholder="Search destination here..."
        refreshKey={refreshKey}
        renderActions={(row) => (
          <div className="space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleEditDestClick(row)}
              aria-label={`Edit destination ${row.name}`}
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
              aria-label={`Delete destination ${row.name}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
        headerActions={
          <Button
            variant="outline"
            aria-label="Add new destination"
            size="lg"
            onClick={handleAddDest}
          >
            <Plus className="h-4 w-4" />
            <span>Add New Destination</span>
          </Button>
        }
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        title="Delete Destination"
        description="Are you sure you want to delete this destination? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
      />

      <DestinationModal
        open={destinationModal.open}
        initialData={destinationModal.editingDest || undefined}
        onClose={() =>
          setDestinationModal((prev) => ({ ...prev, open: false }))
        }
        onSave={(data) => handleCreateDest(data as Destination)}
        loading={destinationModal.loading}
        disableProjectId={false}
      />
    </div>
  );
}
