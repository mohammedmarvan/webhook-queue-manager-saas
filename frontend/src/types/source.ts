export interface SourceData {
  id?: string;
  name: string;
  urlPath: string;
  status: 'active' | 'disabled';
  projectId?: string;
  token?: string;
}

export type SourceDataEdit = {
  id?: string;
  name: string;
  urlPath: string;
  status: 'active' | 'disabled';
  projectId: string;
  token?: string;
};
