import { PageHeader } from '@/components/layout/PageHeader';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { CommonTable } from '@/components/common/common-table';
import { Button } from '@/components/ui/button';
import { useState, useCallback, useMemo } from 'react';
import { deleteProject, createProject } from '@/api/project';
import { AppToast } from '@/components/layout/AppToast';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { type Project } from '@/types/models';
import { type Column } from '@/components/common/common-table';
import { useNavigate } from 'react-router-dom';
import { ProjectModal } from '@/components/project/ProjectEditModal';
import { AxiosError } from 'axios';

export default function ProjectPage() {
  const navigate = useNavigate();

  // Memoize columns to prevent unnecessary re-renders
  const columns: Column<Project>[] = useMemo(
    () => [
      { key: 'name', label: 'Name' },
      { key: 'description', label: 'Description' },
      { key: 'createdAt', label: 'Created At' },
    ],
    []
  );

  // Consolidated state management
  const [refreshKey, setRefreshKey] = useState(0);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    id: number | string | null;
    name: string;
  }>({ open: false, id: null, name: '' });
  const [projectModal, setProjectModal] = useState<{
    open: boolean;
    loading: boolean;
  }>({ open: false, loading: false });

  // Optimized event handlers with useCallback
  const handleDelete = useCallback(async () => {
    if (!deleteDialog.id) return;

    try {
      await deleteProject(deleteDialog.id);
      AppToast.success(`Project "${deleteDialog.name}" deleted successfully`);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error('Error deleting project:', err);
      const axiosErr = err as AxiosError<{ message?: string }>;
      const serverMessage = axiosErr.response?.data?.message;
      AppToast.error(
        serverMessage ?? 'Failed to delete project. Please try again.'
      );
    } finally {
      setDeleteDialog({ open: false, id: null, name: '' });
    }
  }, [deleteDialog.id, deleteDialog.name]);

  const handleAddProject = useCallback(() => {
    setProjectModal((prev) => ({ ...prev, open: true }));
  }, []);

  const handleCreateProject = useCallback(async (projectData: Project) => {
    try {
      setProjectModal((prev) => ({ ...prev, loading: true }));

      const data = {
        name: projectData.name,
        description: projectData.description,
        retentionDays: projectData.retentionDays,
        userId: 2,
      };

      const res = await createProject(data);

      if (res?.status) {
        AppToast.success('Project created successfully');
        setRefreshKey((k) => k + 1);
        setProjectModal({ open: false, loading: false });
      } else {
        AppToast.error('Failed to create project. Please try again.');
      }
    } catch (err) {
      console.error('Error creating project:', err);
      const axiosErr = err as AxiosError<{ message?: string }>;
      const serverMessage = axiosErr.response?.data?.message;
      AppToast.error(
        serverMessage ?? 'Failed to create project. Please try again.'
      );
    } finally {
      setProjectModal((prev) => ({ ...prev, loading: false }));
    }
  }, []);

  const handleDeleteClick = useCallback((row: Project) => {
    setDeleteDialog({
      open: true,
      id: row.id,
      name: row.name,
    });
  }, []);

  const handleEditClick = useCallback(
    (row: Project) => {
      navigate(`/project/${row.id}/edit`);
    },
    [navigate]
  );

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
              onClick={() => handleEditClick(row)}
              aria-label={`Edit project ${row.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteClick(row)}
              aria-label={`Delete project ${row.name}`}
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        )}
        headerActions={
          <Button
            variant="outline"
            aria-label="Add new project"
            size="lg"
            onClick={handleAddProject}
          >
            <Plus className="h-4 w-4" />
            <span>Add Project</span>
          </Button>
        }
      />

      <ConfirmDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog((prev) => ({ ...prev, open }))}
        title="Delete Project"
        description="Are you sure you want to delete this project? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDelete}
      />

      <ProjectModal
        open={projectModal.open}
        onClose={() => setProjectModal((prev) => ({ ...prev, open: false }))}
        onSave={(data) => handleCreateProject(data as Project)}
        loading={projectModal.loading}
      />
    </div>
  );
}
