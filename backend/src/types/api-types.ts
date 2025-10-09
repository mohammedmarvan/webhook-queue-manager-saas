export interface tableSearchParam {
  search: string;
  limit: number;
  page: number;
}

export interface projectCreateParam {
  name: string;
  userId: bigint;
  description?: string;
}

export type projectUpdateParam = Partial<Omit<projectCreateParam, 'userId'>>;

export interface sourceCreateParam {
  projectId: bigint;
  name: string;
  token: string;
  urlPath: string;
  status?: 'active' | 'disabled';
}

export type sourceUpdateParam = Partial<Omit<sourceCreateParam, 'projectId' | 'token'>>;

export interface destinationCreateParam {
  projectId: bigint;
  name: string;
  url: string;
  secret: string;
  retryPolicy: any;
  timeoutMs?: number;
  status?: 'active' | 'disabled';
}

export type destinationUpdateParam = Partial<Omit<destinationCreateParam, 'projectId' | 'secret'>>;
