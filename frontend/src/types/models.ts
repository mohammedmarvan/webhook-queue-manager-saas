export interface Project {
  id: string;
  name: string;
  createdAt?: string;
  description?: string;
  retentionDays?: number;
}

export interface Source {
  id?: string;
  projectId: string | undefined;
  name: string;
  status: 'active' | 'disabled';
  urlPath: string;
  token?: string | undefined;
  projectName?: string;
}

export interface Destination {
  id: string;
  projectId: string;
  name: string;
  url: string;
  status: 'active' | 'disabled';
  secret: string;
  retryPolicy?: any;
  timeoutMs: number;
  projectName?: string;
}

export interface Event {
  id: string;
  projectId: string;
  sourceId: string;
  eventUid: string;
  status: 'received' | 'processing' | 'completed' | 'failed' | 'discarded';
  sourceName: string;
  projectName: string;
  receivedAt: string;
  completedAt: string;
  retryCount: number;
  payload?: any;
  headers?: any;
  deliveries?: Delivery[];
}

export interface Delivery {
  id: string;
  eventId: string;
  destinationId: string;
  attemptNo: number;
  responseStatus?: number;
  errorMessage?: string;
  destinationName?: string;
  durationMs?: number;
  deliveredAt?: string;
}
