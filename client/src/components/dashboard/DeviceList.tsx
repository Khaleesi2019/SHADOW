import { useState } from 'react';
import { useLocation } from "wouter";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeviceCard } from "@/components/ui/device-card";
import { Device } from "@shared/schema";
import { Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface DeviceListProps {
  devices: Device[];
  isLoading?: boolean;
}

export function DeviceList({ devices, isLoading }: DeviceListProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // States for dialogs
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    description: '',
    deviceType: 'smartphone',
    platform: 'Android',
  });
  const [deleteDeviceId, setDeleteDeviceId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmCommand, setConfirmCommand] = useState<{deviceId: number, command: string} | null>(null);
  
  // Add device handler
  const handleAddDevice = async () => {
    try {
      await apiRequest('POST', '/api/devices', newDevice);
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      setIsAddDeviceOpen(false);
      setNewDevice({
        name: '',
        description: '',
        deviceType: 'smartphone',
        platform: 'Android',
      });
      toast({
        title: "Device Added",
        description: "The device has been added successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add device. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Delete device handler
  const handleDeleteDevice = async () => {
    if (!deleteDeviceId) return;
    
    try {
      await apiRequest('DELETE', `/api/devices/${deleteDeviceId}`);
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      setDeleteDeviceId(null);
      toast({
        title: "Device Deleted",
        description: "The device has been deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete device. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle command
  const handleCommand = async () => {
    if (!confirmCommand) return;
    
    try {
      await apiRequest('POST', `/api/devices/${confirmCommand.deviceId}/commands`, {
        commandType: confirmCommand.command
      });
      setIsConfirmOpen(false);
      setConfirmCommand(null);
      toast({
        title: "Command Sent",
        description: "The command has been sent to the device.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send command. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Monitored Devices</h2>
          <Button disabled className="px-3 py-1 text-sm">
            <Plus className="mr-1 h-4 w-4" /> Add Device
          </Button>
        </div>
        <Card className="bg-dark-800 border-gray-800">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Loading devices...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Monitored Devices</h2>
        <Dialog open={isAddDeviceOpen} onOpenChange={setIsAddDeviceOpen}>
          <DialogTrigger asChild>
            <Button className="px-3 py-1 text-sm">
              <Plus className="mr-1 h-4 w-4" /> Add Device
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-dark-800 border-gray-700">
            <DialogHeader>
              <DialogTitle>Add New Device</DialogTitle>
              <DialogDescription>
                Enter the details of the device you want to monitor.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Device Name</Label>
                <Input 
                  id="name" 
                  value={newDevice.name} 
                  onChange={(e) => setNewDevice({...newDevice, name: e.target.value})} 
                  placeholder="e.g. Sarah's iPhone"
                  className="bg-dark-900 border-gray-700"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input 
                  id="description" 
                  value={newDevice.description} 
                  onChange={(e) => setNewDevice({...newDevice, description: e.target.value})} 
                  placeholder="e.g. Work phone"
                  className="bg-dark-900 border-gray-700"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">Device Type</Label>
                  <Select 
                    value={newDevice.deviceType} 
                    onValueChange={(value) => setNewDevice({...newDevice, deviceType: value})}
                  >
                    <SelectTrigger className="bg-dark-900 border-gray-700">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-800 border-gray-700">
                      <SelectItem value="smartphone">Smartphone</SelectItem>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="laptop">Laptop</SelectItem>
                      <SelectItem value="desktop">Desktop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Select 
                    value={newDevice.platform} 
                    onValueChange={(value) => setNewDevice({...newDevice, platform: value})}
                  >
                    <SelectTrigger className="bg-dark-900 border-gray-700">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent className="bg-dark-800 border-gray-700">
                      <SelectItem value="Android">Android</SelectItem>
                      <SelectItem value="iOS">iOS</SelectItem>
                      <SelectItem value="Windows">Windows</SelectItem>
                      <SelectItem value="macOS">macOS</SelectItem>
                      <SelectItem value="Linux">Linux</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDeviceOpen(false)}
                className="bg-dark-900 border-gray-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddDevice}
                disabled={!newDevice.name}
              >
                Add Device
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="space-y-3">
        {devices.length > 0 ? (
          devices.map((device) => (
            <DeviceCard 
              key={device.id} 
              device={device} 
              onViewDetails={(id) => setLocation(`/device/${id}`)}
              onDelete={(id) => setDeleteDeviceId(id)}
              onCommand={(deviceId, command) => {
                setConfirmCommand({ deviceId, command });
                setIsConfirmOpen(true);
              }}
            />
          ))
        ) : (
          <Card className="bg-dark-800 border-gray-800">
            <CardContent className="p-6 text-center">
              <p className="text-gray-400">No devices found. Add a device to start monitoring.</p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Confirm delete dialog */}
      <AlertDialog open={!!deleteDeviceId} onOpenChange={(open) => !open && setDeleteDeviceId(null)}>
        <AlertDialogContent className="bg-dark-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this device and all its associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-dark-900 border-gray-700"
              onClick={() => setDeleteDeviceId(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700" 
              onClick={handleDeleteDevice}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Confirm command dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-dark-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Action</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to perform this action on the device?
              <div className="mt-4 bg-dark-900 rounded-md p-3 text-sm text-yellow-500">
                This action cannot be undone and may alert the device user.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-dark-900 border-gray-700"
              onClick={() => {
                setIsConfirmOpen(false);
                setConfirmCommand(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700" 
              onClick={handleCommand}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
