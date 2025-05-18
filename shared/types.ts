// Activity item type for activity feed
export type ActivityItem = {
  id: number;
  type: 'call' | 'location' | 'message' | 'wifi' | 'battery' | 'photo' | 'recording' | 'command';
  title: string;
  description: string;
  timestamp: Date;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
};

// Device status type
export type DeviceStatus = 'online' | 'offline' | 'idle';

// Command type
export type CommandType = 'alarm' | 'lock' | 'wipe' | 'photo' | 'recording';

// Command status type
export type CommandStatus = 'pending' | 'executed' | 'failed';

// Stats card data type
export type StatsCardData = {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  progress?: number;
  description?: string;
};

// Quick action type
export type QuickAction = {
  title: string;
  icon: string;
  action: () => void;
  iconBg: string;
  iconColor: string;
};

// Chart data types
export type ChartDataPoint = {
  name: string;
  value: number;
};

export type ChartData = {
  title: string;
  data: ChartDataPoint[];
};
