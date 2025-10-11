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
import { type DestinationData } from '@/types/destination';
import { PageLoader } from '@/components/layout/PageLoader';
import { ProjectCombobox } from '../project/ProjectCombobox';

interface DestinationModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: DestinationData | null; // if editing, pass existing data
  onSave: (data: DestinationData) => void;
  disableProjectId?: boolean;
  loading: boolean;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  open,
  onClose,
  initialData,
  onSave,
  disableProjectId,
  loading,
}) => {
  const [form, setForm] = useState<DestinationData>({
    id: '',
    projectId: '',
    name: '',
    url: '',
    secret: '',
    retryPolicy: {},
    timeoutMs: 5000,
    status: 'active',
  });

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
    } else {
      setForm({
        id: '',
        projectId: '',
        name: '',
        url: '',
        secret: '',
        retryPolicy: {},
        timeoutMs: 5000,
        status: 'active',
      });
    }
  }, [initialData]);

  const handleChange = (field: keyof DestinationData, value: unknown) => {
    setForm((prev) => ({ ...prev, [field]: value }));
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
            {initialData ? 'Edit Destination' : 'Add New Destination'}
          </DialogTitle>
          <DialogDescription className="py-2">
            {initialData
              ? "Edit destination details here. Click save when you're done."
              : 'Fill in the details to create a new destination.'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name" className="font-bold">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Destination Name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="url" className="font-bold">
              URL
            </Label>
            <Input
              id="url"
              placeholder="Destination URL"
              value={form.url}
              onChange={(e) => handleChange('url', e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="secret" className="font-bold">
              Secret
            </Label>
            <Input
              id="secret"
              placeholder="Secret"
              value={form.secret}
              onChange={(e) => handleChange('secret', e.target.value)}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="timeoutMs" className="font-bold">
              Timeout (ms)
            </Label>
            <Input
              id="timeoutMs"
              type="number"
              min={100}
              value={form.timeoutMs}
              onChange={(e) =>
                handleChange('timeoutMs', parseInt(e.target.value, 10))
              }
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="maxRetries" className="font-bold">
              Max Retries
            </Label>
            <Input
              id="maxRetries"
              type="number"
              value={form.retryPolicy?.maxRetries ?? ''}
              onChange={(e) =>
                handleChange('retryPolicy', {
                  ...form.retryPolicy,
                  maxRetries: parseInt(e.target.value, 10),
                })
              }
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="backoffMs" className="font-bold">
              Backoff (ms)
            </Label>
            <Input
              id="backoffMs"
              type="number"
              value={form.retryPolicy?.backoff ?? ''}
              onChange={(e) =>
                handleChange('retryPolicy', {
                  ...form.retryPolicy,
                  backoff: parseInt(e.target.value, 10),
                })
              }
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
            {initialData ? 'Save Changes' : 'Add Destination'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
