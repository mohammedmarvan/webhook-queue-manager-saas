export interface DashboardData {
  counts: {
    eventsLast24h: number;
    sourcesCount: number;
    destinationsCount: number;
    deliveriesLast24h: number;
  };
  hourly: {
    hour: number;
    events: number;
    deliveries: number;
  }[];
  status?: number;
  data?: {};
}

export interface DashboardResponse {
  status: number;
  message?: string;
  data: DashboardData;
}
