import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Device, Location } from "@shared/schema";
import { Layout } from "@/components/layouts/Layout";
import { Map } from "@/components/ui/map";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Timeline } from "@/components/ui/timeline";
import { formatDateTime } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Clock, Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

export default function LocationTracking() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  
  // Get devices
  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  // Get locations for selected device
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: selectedDeviceId ? [`/api/devices/${selectedDeviceId}/locations`] : null,
    enabled: !!selectedDeviceId,
  });
  
  // Set active location when locations change
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(Number(deviceId));
    setActiveLocation(null);
  };
  
  // Format locations for the map
  const mapLocations = locations.map(loc => ({
    latitude: loc.latitude,
    longitude: loc.longitude,
    name: devices.find(d => d.id === selectedDeviceId)?.name || "Device"
  }));
  
  // Format locations for timeline
  const timelinePoints = locations.map((loc, index) => ({
    id: loc.id,
    time: loc.timestamp ? new Date(loc.timestamp) : new Date(),
    label: loc.address || "Location",
    active: activeLocation ? loc.id === activeLocation.id : index === 0,
    onClick: () => setActiveLocation(loc)
  }));
  
  // Add placeholder for next location
  if (timelinePoints.length > 0) {
    timelinePoints.push({
      id: 'next',
      time: "--:--",
      label: "Next",
      active: false
    });
  }
  
  return (
    <Layout>
      <div className="border-b border-gray-800 bg-dark-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Location Tracking</h1>
            <p className="text-sm text-gray-400">Track and view device locations</p>
          </div>
          <div className="flex items-center">
            <Select value={selectedDeviceId?.toString() || ""} onValueChange={handleDeviceChange}>
              <SelectTrigger className="w-[200px] bg-dark-900 border-gray-700">
                <SelectValue placeholder="Select a device" />
              </SelectTrigger>
              <SelectContent className="bg-dark-800 border-gray-700">
                {devices.map((device) => (
                  <SelectItem key={device.id} value={device.id.toString()}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6 flex flex-col space-y-6">
        {/* Map Card */}
        <Card className="bg-dark-800 border-gray-800">
          <CardHeader className="px-4 py-3 border-b border-gray-800 flex-row justify-between items-center">
            <CardTitle className="text-base font-medium">Location Map</CardTitle>
            <div className="flex space-x-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-dark-900 border-gray-700 flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-dark-800 border-gray-700">
                  <Calendar
                    mode="single"
                    selected={selectedDate || undefined}
                    onSelect={setSelectedDate}
                    initialFocus
                    className="bg-dark-800"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Map 
              locations={mapLocations}
              className="h-[500px]"
            />
          </CardContent>
        </Card>
        
        {/* Timeline Card */}
        <Card className="bg-dark-800 border-gray-800">
          <CardHeader className="px-4 py-3 border-b border-gray-800">
            <CardTitle className="text-base font-medium">Location Timeline</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {timelinePoints.length > 1 ? (
              <>
                <Timeline points={timelinePoints} />
                {activeLocation && (
                  <div className="mt-6 p-4 bg-dark-900 rounded-lg">
                    <h3 className="text-lg font-medium mb-3">Location Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-start space-x-3">
                        <MapPin className="h-5 w-5 text-primary-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-300">Address</p>
                          <p className="text-sm text-gray-400">
                            {activeLocation.address || "No address information"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-primary-400 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-300">Timestamp</p>
                          <p className="text-sm text-gray-400">
                            {activeLocation.timestamp ? formatDateTime(activeLocation.timestamp) : "Unknown time"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="h-5 w-5 flex items-center justify-center text-primary-400 mt-0.5">
                          <span className="text-sm">Lat</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-300">Latitude</p>
                          <p className="text-sm text-gray-400">{activeLocation.latitude}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="h-5 w-5 flex items-center justify-center text-primary-400 mt-0.5">
                          <span className="text-sm">Lng</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-300">Longitude</p>
                          <p className="text-sm text-gray-400">{activeLocation.longitude}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 text-center text-gray-500">
                {selectedDeviceId ? "No location data available for this device." : "Please select a device to view location data."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
