export interface DestinationData {
  id?: string;
  projectId?: string;
  name: string;
  url: string;
  secret: string;
  retryPolicy?: any;
  timeoutMs: number;
  status: 'active' | 'disabled';
}
