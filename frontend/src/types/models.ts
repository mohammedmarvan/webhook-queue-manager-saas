export interface Project {
  id: string;
  name: string;
  description?: string;
  retentionDays?: number;
}

export interface Source {
  id: string;
  projectId: string;
  name: string;
  status: 'active' | 'disabled';
}

export interface Destination {
  id: string;
  projectId: string;
  name: string;
  url: string;
  status: 'active' | 'disabled';
}

export interface Event {
  id: string;
  projectId: string;
  sourceId: string;
  eventUid: string;
  status: 'received' | 'processing' | 'completed' | 'failed' | 'discarded';
}

export interface Delivery {
  id: string;
  eventId: string;
  destinationId: string;
  attemptNo: number;
  responseStatus?: number;
  errorMessage?: string;
}
