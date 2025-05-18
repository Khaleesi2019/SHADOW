import { StatsCard } from "@/components/ui/stats-card";
import { Smartphone, AlertTriangle, Database } from "lucide-react";
import { Device } from "@shared/schema";

interface DeviceSummaryProps {
  devices: Device[];
}

export function DeviceSummary({ devices }: DeviceSummaryProps) {
  // Calculate count of online devices
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const onlinePercentage = devices.length > 0 ? (onlineDevices / devices.length) * 100 : 0;
  
  // Calculate alerts (we'll use a mock number for now)
  const alerts = {
    total: 5,
    critical: 2,
    warnings: 3,
    percentage: 40
  };
  
  // Calculate storage (mock data for now)
  const storage = {
    used: 48.2,
    total: 80,
    percentage: 60
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        <StatsCard
          title="Active Devices"
          value={devices.length}
          icon={<Smartphone />}
          color="text-primary-400"
          bgColor="bg-primary-800/30"
          progress={onlinePercentage}
          description={`${onlinePercentage.toFixed(0)}% online`}
        />
        
        <StatsCard
          title="Alerts"
          value={alerts.total}
          icon={<AlertTriangle />}
          color="text-red-500"
          bgColor="bg-red-800/30"
          progress={alerts.percentage}
          description={`${alerts.critical} critical, ${alerts.warnings} warnings`}
        />
        
        <StatsCard
          title="Storage Used"
          value={`${storage.used} GB`}
          icon={<Database />}
          color="text-purple-400"
          bgColor="bg-purple-800/30"
          progress={storage.percentage}
          description={`${storage.percentage}% of your ${storage.total} GB quota`}
        />
      </div>
    </div>
  );
}
