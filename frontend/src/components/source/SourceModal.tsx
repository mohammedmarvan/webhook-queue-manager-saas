import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { type SourceData } from '@/types/source';
import { PageLoader } from '@/components/layout/PageLoader';
import { ProjectCombobox } from '../project/ProjectCombobox';

interface SourceModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: SourceData; // if editing, pass existing data
  onSave: (data: SourceData) => void;
  disableProjectId?: boolean;
  loading?: boolean;
}

export const SourceModal: React.FC<SourceModalProps> = ({
  open,
  onClose,
  initialData,
  onSave,
  disableProjectId,
  loading,
}) => {
  const [form, setForm] = useState<SourceData>({
    id: '',
    name: '',
    urlPath: '',
    status: 'active',
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({ id: '', name: '', urlPath: '', status: 'active' });
    }
  }, [initialData]);

  const handleChange = (field: keyof SourceData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(form);
    //   onClose();
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
            {initialData ? 'Edit Source' : 'Add New Source'}
            <DialogDescription className="py-4">
              {initialData
                ? "Edit Source Here. Click save when you're done."
                : "Add New Source. Click save when you're done."}
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1" className="font-bold">
              Name
            </Label>
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="url-path" className="font-bold">
              URL Path
            </Label>
            <Input
              placeholder="URL Path"
              value={form.urlPath}
              onChange={(e) => handleChange('urlPath', e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="token" className="font-bold">
              Token
            </Label>
            <Input
              placeholder="Token"
              value={form.token}
              onChange={(e) => handleChange('token', e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <ProjectCombobox
              value={form.projectId}
              onChange={(val) => handleChange('projectId', val)}
              disabled={disableProjectId}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="status" className="font-bold">
              Status
            </Label>
            <Select
              value={form.status}
              onValueChange={(value) => handleChange('status', value)}
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {initialData ? 'Save Changes' : 'Add Source'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
