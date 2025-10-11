export interface ProjectData {
  id?: string;
  name: string;
  description?: string;
  retentionDays: number;
  status?: 'active' | 'disabled'; // optional, for UI control
}

export interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: ProjectData; // if editing, pass existing data
  onSave: (data: ProjectData) => void;
  loading: boolean;
}
