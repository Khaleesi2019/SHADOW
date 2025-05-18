import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Device, Command } from "@shared/schema";
import { Layout } from "@/components/layouts/Layout";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  Lock, 
  Trash2, 
  Camera, 
  Mic, 
  RefreshCw,
  ShieldAlert,
  AlertTriangle
} from "lucide-react";
import { formatTimeAgo, getStatusColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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

export default function DeviceControl() {
  const { toast } = useToast();
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmCommand, setConfirmCommand] = useState<{
    type: string;
    title: string;
    description: string;
  } | null>(null);
  
  // Get devices
  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  // Get selected device
  const selectedDevice = devices.find(d => d.id === selectedDeviceId);
  
  // Get commands for selected device
  const { data: commands = [] } = useQuery<Command[]>({
    queryKey: selectedDeviceId ? [`/api/devices/${selectedDeviceId}/commands`] : null,
    enabled: !!selectedDeviceId,
  });
  
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(Number(deviceId));
  };
  
  const handleCommand = async (commandType: string) => {
    if (!selectedDeviceId) return;
    
    try {
      await apiRequest('POST', `/api/devices/${selectedDeviceId}/commands`, {
        commandType
      });
      
      toast({
        title: "Command Sent",
        description: `The ${commandType} command has been sent to the device.`,
      });
      
      setIsConfirmOpen(false);
      setConfirmCommand(null);
      
      // Refresh commands
      queryClient.invalidateQueries({ queryKey: [`/api/devices/${selectedDeviceId}/commands`] });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send command. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Recent commands to display
  const recentCommands = commands.slice(0, 5);
  
  // Command cards data
  const commandCards = [
    {
      title: "Trigger Alarm",
      description: "Activate a loud alarm on the device, even if it's on silent mode",
      icon: <Bell className="h-8 w-8 text-red-500" />,
      bgColor: "bg-red-900/50",
      commandType: "alarm",
      confirmDescription: "This will make the device emit a loud alarm sound even if it's on silent mode."
    },
    {
      title: "Lock Device",
      description: "Immediately lock the device and require PIN for access",
      icon: <Lock className="h-8 w-8 text-yellow-500" />,
      bgColor: "bg-yellow-900/50",
      commandType: "lock",
      confirmDescription: "This will lock the device immediately and require a PIN to unlock."
    },
    {
      title: "Wipe Device",
      description: "Factory reset the device and erase all data",
      icon: <Trash2 className="h-8 w-8 text-red-400" />,
      bgColor: "bg-red-950/50",
      commandType: "wipe",
      confirmDescription: "This will erase ALL data on the device and restore it to factory settings. This action is irreversible."
    },
    {
      title: "Take Photo",
      description: "Secretly capture a photo from the device camera",
      icon: <Camera className="h-8 w-8 text-green-500" />,
      bgColor: "bg-green-900/50",
      commandType: "photo",
      confirmDescription: "This will secretly take a photo using the device's front camera."
    },
    {
      title: "Record Audio",
      description: "Silently record audio from the device microphone",
      icon: <Mic className="h-8 w-8 text-blue-500" />,
      bgColor: "bg-blue-900/50",
      commandType: "recording",
      confirmDescription: "This will start recording audio from the device's microphone."
    },
    {
      title: "Refresh Data",
      description: "Force the device to sync all data immediately",
      icon: <RefreshCw className="h-8 w-8 text-primary-500" />,
      bgColor: "bg-primary-900/50",
      commandType: "refresh",
      confirmDescription: "This will force the device to sync all data and update location information."
    }
  ];
  
  return (
    <Layout>
      <div className="border-b border-gray-800 bg-dark-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Device Control</h1>
            <p className="text-sm text-gray-400">Remote control and emergency commands</p>
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
        {selectedDevice ? (
          <>
            {/* Device Status Card */}
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">Device Status</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Status</p>
                    <div className="flex items-center">
                      <span className={`w-2.5 h-2.5 rounded-full mr-2 ${
                        selectedDevice.status === 'online' ? 'bg-green-500' :
                        selectedDevice.status === 'idle' ? 'bg-amber-500' : 'bg-red-500'
                      }`}></span>
                      <span className="font-medium">{selectedDevice.status}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Last Activity</p>
                    <p className="font-medium">
                      {selectedDevice.lastActivity ? formatTimeAgo(selectedDevice.lastActivity) : 'Never'}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">Battery</p>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{selectedDevice.battery || 'Unknown'}%</span>
                      </div>
                      <Progress 
                        value={selectedDevice.battery || 0} 
                        className="h-2 bg-dark-900" 
                        indicatorColor={
                          (selectedDevice.battery || 0) > 50 ? 'bg-green-500' :
                          (selectedDevice.battery || 0) > 20 ? 'bg-amber-500' : 'bg-red-500'
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Command Grid */}
            <div>
              <h2 className="text-xl font-bold mb-4">Available Commands</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {commandCards.map((command, index) => (
                  <Card 
                    key={index} 
                    className="bg-dark-800 border-gray-800 hover:bg-dark-700 transition-colors"
                  >
                    <CardHeader className="px-4 py-3 flex flex-row items-center space-y-0 gap-3">
                      <div className={`h-12 w-12 rounded-lg ${command.bgColor} flex items-center justify-center flex-shrink-0`}>
                        {command.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{command.title}</CardTitle>
                        <CardDescription className="text-gray-400 text-sm">
                          {command.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardFooter className="px-4 py-3 border-t border-gray-800">
                      <Button 
                        className="w-full"
                        variant={command.commandType === 'wipe' ? 'destructive' : 'default'}
                        onClick={() => {
                          setConfirmCommand({
                            type: command.commandType,
                            title: command.title,
                            description: command.confirmDescription
                          });
                          setIsConfirmOpen(true);
                        }}
                        disabled={!selectedDeviceId}
                      >
                        Execute Command
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            
            {/* Recent Commands */}
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">Recent Commands</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {recentCommands.length > 0 ? (
                  <div className="divide-y divide-gray-800">
                    {recentCommands.map((command) => (
                      <div key={command.id} className="px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                            command.commandType === 'alarm' ? 'bg-red-900/50 text-red-500' :
                            command.commandType === 'lock' ? 'bg-yellow-900/50 text-yellow-500' :
                            command.commandType === 'wipe' ? 'bg-red-950/50 text-red-400' :
                            command.commandType === 'photo' ? 'bg-green-900/50 text-green-500' :
                            command.commandType === 'recording' ? 'bg-blue-900/50 text-blue-500' :
                            'bg-primary-900/50 text-primary-500'
                          }`}>
                            {command.commandType === 'alarm' ? <Bell className="h-4 w-4" /> :
                             command.commandType === 'lock' ? <Lock className="h-4 w-4" /> :
                             command.commandType === 'wipe' ? <Trash2 className="h-4 w-4" /> :
                             command.commandType === 'photo' ? <Camera className="h-4 w-4" /> :
                             command.commandType === 'recording' ? <Mic className="h-4 w-4" /> :
                             <RefreshCw className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">
                              {command.commandType.charAt(0).toUpperCase() + command.commandType.slice(1)}
                            </p>
                            <p className="text-xs text-gray-400">
                              {command.createdAt ? formatTimeAgo(command.createdAt) : 'Unknown time'}
                            </p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(command.status)}
                        >
                          {command.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-gray-500">
                    No commands have been sent to this device.
                  </div>
                )}
              </CardContent>
              {recentCommands.length > 0 && (
                <CardFooter className="px-4 py-3 border-t border-gray-800">
                  <Button 
                    variant="link" 
                    className="text-primary-400 hover:text-primary-300 mx-auto"
                    onClick={() => window.location.href = '/command-history'}
                  >
                    View All Commands
                  </Button>
                </CardFooter>
              )}
            </Card>
          </>
        ) : (
          <Card className="bg-dark-800 border-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <ShieldAlert className="h-16 w-16 text-gray-600 mb-4" />
              <p className="text-xl text-gray-400 mb-2">No Device Selected</p>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                Please select a device from the dropdown above to access control features.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Confirm command dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-dark-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm {confirmCommand?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmCommand?.description}
              <div className="mt-4 bg-dark-900 rounded-md p-3 text-sm text-yellow-500 flex items-start">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>
                  This action cannot be undone and may alert the device user.
                  {confirmCommand?.type === 'wipe' && ' All data on the device will be permanently erased.'}
                </span>
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
              className={confirmCommand?.type === 'wipe' ? 'bg-red-600 hover:bg-red-700' : ''}
              onClick={() => handleCommand(confirmCommand?.type || '')}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
