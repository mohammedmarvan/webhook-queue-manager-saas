import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { type ProjectData, type ProjectModalProps } from '@/types/project';
import { PageLoader } from '../layout/PageLoader';

export const ProjectModal: React.FC<ProjectModalProps> = ({
  open,
  onClose,
  initialData,
  onSave,
  loading,
}) => {
  const [form, setForm] = useState<ProjectData>({
    id: '',
    name: '',
    description: '',
    retentionDays: 7,
    status: 'active',
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: '',
        name: '',
        description: '',
        retentionDays: 7,
        status: 'active',
      });
    }
  }, [initialData]);

  const handleChange =
    (field: keyof ProjectData) =>
    (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        {/* Loader overlay inside modal */}
        {loading && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/60">
            <PageLoader />
          </div>
        )}

        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Edit Project' : 'Add New Project'}
          </DialogTitle>
          <DialogDescription className="py-2">
            {initialData
              ? "Edit project details here. Click save when you're done."
              : 'Fill in the details to create a new project.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name" className="font-bold">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Project Name"
              value={form.name}
              onChange={handleChange('name')}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="description" className="font-bold">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Optional description"
              value={form.description ?? ''}
              onChange={handleChange('description')}
              className="min-h-[100px]" // optional: control height
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="retentionDays" className="font-bold">
              Retention Days
            </Label>
            <Input
              id="retentionDays"
              type="number"
              min={1}
              value={form.retentionDays}
              onChange={handleChange('retentionDays')}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Add Project'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
