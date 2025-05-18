import { useQuery } from "@tanstack/react-query";
import { Device } from "@shared/schema";
import { Layout } from "@/components/layouts/Layout";
import { DeviceSummary } from "@/components/dashboard/DeviceSummary";
import { DeviceList } from "@/components/dashboard/DeviceList";
import { LocationTracker } from "@/components/dashboard/LocationTracker";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Bell, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  
  // Fetch devices
  const { data: devices = [], isLoading } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });

  // Get online devices for active device in location tracker
  const onlineDevices = devices.filter(device => device.status === 'online');
  const activeDevice = onlineDevices.length > 0 ? onlineDevices[0] : devices[0];

  return (
    <Layout>
      {/* TopBar */}
      <div className="border-b border-gray-800 bg-dark-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Dashboard</h1>
            <p className="text-sm text-gray-400">Monitoring overview</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
              <Cog className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarImage src={user?.profileImageUrl} />
              <AvatarFallback className="bg-primary-700 text-white text-xs">
                {user?.firstName && user.lastName 
                  ? `${user.firstName[0]}${user.lastName[0]}`
                  : user?.email?.[0].toUpperCase() || 'AU'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="p-4 md:p-6 overflow-auto">
        {/* Device Summary */}
        <DeviceSummary devices={devices} />
        
        {/* Device List */}
        <DeviceList devices={devices} isLoading={isLoading} />
        
        {/* Device Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Location Tracker */}
          <LocationTracker devices={devices} selectedDeviceId={activeDevice?.id} />
          
          {/* Activity Feed */}
          <ActivityFeed device={activeDevice} />
        </div>
        
        {/* Quick Actions */}
        <QuickActions device={activeDevice} />
      </div>
    </Layout>
  );
}
