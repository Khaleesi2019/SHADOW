import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Map } from "@/components/ui/map";
import { Timeline } from "@/components/ui/timeline";
import { Device, Location } from "@shared/schema";
import { formatTime } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

interface LocationTrackerProps {
  devices: Device[];
  selectedDeviceId?: number;
}

export function LocationTracker({ devices, selectedDeviceId }: LocationTrackerProps) {
  const [activeDevice, setActiveDevice] = useState<Device | null>(null);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);

  // Set active device from props or select first online device
  useEffect(() => {
    if (selectedDeviceId) {
      const device = devices.find(d => d.id === selectedDeviceId);
      if (device) {
        setActiveDevice(device);
      }
    } else if (devices.length > 0) {
      const onlineDevices = devices.filter(d => d.status === 'online');
      setActiveDevice(onlineDevices.length > 0 ? onlineDevices[0] : devices[0]);
    }
  }, [devices, selectedDeviceId]);

  // Fetch locations for the active device
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: activeDevice ? [`/api/devices/${activeDevice.id}/locations`] : null,
    enabled: !!activeDevice,
  });

  // Set active location when locations change
  useEffect(() => {
    if (locations && locations.length > 0) {
      setActiveLocation(locations[0]);
    }
  }, [locations]);

  // Format locations for the map
  const mapLocations = locations.map(loc => ({
    latitude: loc.latitude,
    longitude: loc.longitude,
    name: activeDevice?.name || "Device"
  }));

  // Format locations for timeline
  const timelinePoints = locations.map((loc, index) => ({
    id: index,
    time: loc.timestamp ? new Date(loc.timestamp) : "--:--",
    label: loc.address || "Location",
    active: activeLocation ? loc.id === activeLocation.id : index === 0,
    onClick: () => setActiveLocation(loc)
  }));

  // If there are no future locations, add a placeholder
  if (timelinePoints.length > 0) {
    timelinePoints.push({
      id: 'next',
      time: "--:--",
      label: "Next",
      active: false
    });
  }

  return (
    <Card className="bg-dark-800 border border-gray-800 lg:col-span-2 overflow-hidden">
      <CardHeader className="px-4 py-3 border-b border-gray-800 flex-row justify-between items-center">
        <CardTitle className="text-base font-medium">Location Tracking</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="text-xs bg-primary-800 hover:bg-primary-700 text-primary-200">
            History
          </Button>
          <Button size="sm" className="text-xs">
            Live View
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="relative">
          {/* Map */}
          <Map 
            locations={mapLocations}
            className="h-72"
          />
          
          <div className="px-4 py-3 bg-dark-900/80">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">Today's Movement</h4>
              <span className="text-xs text-gray-400">{locations.length} locations</span>
            </div>
            
            <Timeline points={timelinePoints} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
