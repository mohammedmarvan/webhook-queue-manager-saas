import { PageHeader } from '@/components/layout/PageHeader';
import { Pencil, Trash2 } from 'lucide-react';
import { CommonTable } from '@/components/common/common-table';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import {
  deleteDestination,
  updateDestination,
  createDestination,
} from '@/api/destination';
import { AppToast } from '@/components/layout/AppToast';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { type Column } from '@/components/common/common-table';
import { Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { type Destination } from '@/types/models';
import { DestinationModal } from '@/components/destination/DestinationEditModal';
import type { DestinationData } from '@/types/destination';
import { AxiosError } from 'axios';

export default function SourcePage() {
  const columns: Column<Destination>[] = [
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
  ];
  const [refreshKey, setRefreshKey] = useState(0);
  const [open, setOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string | null | undefined>(
    null
  );
  const [deleteName, setDeleteName] = useState<string>('');
  const [openDestModal, setOpenDestModal] = useState(false);
  const [editingDest, setEditingDest] = useState<DestinationData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setLoading(true);
      await deleteDestination(deleteId);
      AppToast.success(`Destination "${deleteName}" deleted successfully`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.log('Error in deleting destination ', err);
      const axiosErr = err as AxiosError<{ message?: string }>;
      const serverMessage = axiosErr.response?.data?.message;
      AppToast.error(serverMessage ?? `Error in deleting destination.`);
    } finally {
      setLoading(false);
      setOpen(false);
      setDeleteId(null);
    }
  };

  const handleEditDestClick = async (destData: DestinationData) => {
    setEditingDest(destData);
    setOpenDestModal(true);
  };

  const handleAddDest = async () => {
    setEditingDest(null);
    setOpenDestModal(true);
  };

  const handleCreateDest = async (destData: Destination) => {
    try {
      setLoading(true);
      if (destData.id) {
        const data = {
          name: destData.name,
          projectId: destData.projectId,
          url: destData.url,
          status: destData.status,
          id: destData.id,
          secret: destData.secret,
          retryPolicy: destData.retryPolicy,
          timeoutMs: destData.timeoutMs,
        };
        const res = await updateDestination(data);
        if (res?.status) {
          AppToast.success(`Destination updated successfully`);
          setRefreshKey((k) => k + 1);
        } else {
          AppToast.error(
            res?.message ?? 'Something went wrong while updating destination'
          );
        }
      } else {
        const data = {
          name: destData.name,
          projectId: destData.projectId,
          url: destData.url,
          status: destData.status,
          secret: destData.secret,
          retryPolicy: destData.retryPolicy,
          timeoutMs: destData.timeoutMs,
        };
        const res = await createDestination(data);

        if (res?.status) {
          AppToast.success(`Destination created successfully`);
          setRefreshKey((k) => k + 1);
        } else {
          AppToast.error(
            res?.message ?? 'Something went wrong in creating destination'
          );
        }
      }
      setOpenDestModal(false);
    } catch (err: any) {
      console.log(`Error in creating destination `, err);
      const axiosErr = err as AxiosError<{ message?: string }>;
      const serverMessage = axiosErr.response?.data?.message;
      AppToast.error(
        serverMessage ?? 'Something went wrong in creating destination'
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
        open={open}
        onOpenChange={setOpen}
        title="Delete Destination"
        description="Are you sure you want to delete this destination? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
      />

      <DestinationModal
        open={openDestModal}
        initialData={editingDest}
        onClose={() => setOpenDestModal(false)}
        onSave={(data) => handleCreateDest(data as Destination)}
        loading={loading}
        disableProjectId={false}
      />
    </div>
  );
}
