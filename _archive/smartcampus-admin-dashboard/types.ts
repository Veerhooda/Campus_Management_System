
export interface LogEntry {
  id: string;
  time: string;
  type: 'WARNING' | 'INFO' | 'ERROR' | 'SUCCESS';
  title: string;
  location: string;
}

export interface StatItem {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  status?: string;
  icon: string;
  colorClass: string;
}

export interface ChartDataPoint {
  day: string;
  students: number;
  faculty: number;
}
