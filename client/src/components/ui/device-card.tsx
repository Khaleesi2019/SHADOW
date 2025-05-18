import * as React from "react";
import { cn, formatTimeAgo, getPlatformColor } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Device } from "@shared/schema";
import { 
  Smartphone, 
  Tablet, 
  Laptop, 
  Dock, 
  Eye, 
  MoreVertical
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface DeviceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  device: Device;
  onViewDetails?: (deviceId: number) => void;
  onDelete?: (deviceId: number) => void;
  onCommand?: (deviceId: number, command: string) => void;
}

export function DeviceCard({ 
  device, 
  onViewDetails, 
  onDelete,
  onCommand,
  className, 
  ...props 
}: DeviceCardProps) {
  // Determine icon based on device type
  const DeviceIcon = () => {
    switch (device.deviceType.toLowerCase()) {
      case 'smartphone':
        return <Smartphone className="text-primary-400" />;
      case 'tablet':
        return <Tablet className="text-red-500" />;
      case 'laptop':
        return <Laptop className="text-blue-500" />;
      case 'desktop':
        return <Dock className="text-purple-500" />;
      default:
        return <Smartphone className="text-primary-400" />;
    }
  };

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'online':
        return "bg-green-500";
      case 'offline':
        return "bg-red-500";
      case 'idle':
        return "bg-amber-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className={cn("bg-dark-800 border-gray-800 hover:bg-dark-900/50 transition-colors", className)} {...props}>
      <CardContent className="p-4">
        <div className="grid grid-cols-12 gap-3 items-center">
          <div className="col-span-6 md:col-span-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 bg-dark-900 rounded-md flex items-center justify-center mr-3">
                <DeviceIcon />
              </div>
              <div>
                <div className="text-sm font-medium">{device.name}</div>
                <div className="text-xs text-gray-400">{device.description}</div>
              </div>
            </div>
          </div>
          
          <div className="col-span-2 hidden md:block">
            <span className={cn(
              "text-xs py-1 px-2 rounded",
              getPlatformColor(device.platform)
            )}>
              {device.platform}
            </span>
          </div>
          
          <div className="col-span-3 md:col-span-2">
            <div className="flex items-center">
              <span className={cn(
                "w-2.5 h-2.5 rounded-full mr-2",
                getStatusColor(device.status)
              )}></span>
              <span className="text-sm">{device.status}</span>
            </div>
          </div>
          
          <div className="col-span-3 md:col-span-2 text-sm text-gray-400">
            {device.lastActivity ? formatTimeAgo(device.lastActivity) : 'Never'}
          </div>
          
          <div className="col-span-2 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onViewDetails?.(device.id)}
              title="View Details"
              className="text-gray-400 hover:text-white"
            >
              <Eye className="h-4 w-4" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-400 hover:text-white"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-dark-800 border-gray-700">
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={() => onCommand?.(device.id, 'alarm')}
                >
                  Trigger Alarm
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={() => onCommand?.(device.id, 'lock')}
                >
                  Lock Device
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={() => onCommand?.(device.id, 'photo')}
                >
                  Take Photo
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer" 
                  onClick={() => onCommand?.(device.id, 'recording')}
                >
                  Record Audio
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer text-red-500" 
                  onClick={() => onDelete?.(device.id)}
                >
                  Delete Device
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
