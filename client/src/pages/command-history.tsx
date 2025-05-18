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
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Lock, 
  Trash2, 
  Camera, 
  Mic, 
  RefreshCw,
  History,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime, getStatusColor } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function CommandHistory() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [commandTypes, setCommandTypes] = useState<string[]>([]);
  const [statusTypes, setStatusTypes] = useState<string[]>([]);
  
  // Get devices
  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  // Get commands - either for all devices or specific device
  const { data: commands = [], isLoading } = useQuery<Command[]>({
    queryKey: selectedDeviceId ? [`/api/devices/${selectedDeviceId}/commands`] : ['/api/commands'],
  });
  
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId === 'all' ? null : Number(deviceId));
  };
  
  // Filter commands based on selected filters
  const filteredCommands = commands.filter(command => {
    if (commandTypes.length > 0 && !commandTypes.includes(command.commandType)) {
      return false;
    }
    if (statusTypes.length > 0 && !statusTypes.includes(command.status)) {
      return false;
    }
    return true;
  });
  
  // Toggle command type filter
  const toggleCommandType = (type: string) => {
    setCommandTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };
  
  // Toggle status type filter
  const toggleStatusType = (status: string) => {
    setStatusTypes(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status]
    );
  };
  
  // Define columns for commands table
  const columns = [
    {
      header: "Command",
      accessorKey: (command: Command) => (
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
            <p className="font-medium">
              {command.commandType.charAt(0).toUpperCase() + command.commandType.slice(1)}
            </p>
          </div>
        </div>
      ),
      className: "w-1/4",
    },
    {
      header: "Device",
      accessorKey: (command: Command) => {
        const device = devices.find(d => d.id === command.deviceId);
        return device ? device.name : `Device #${command.deviceId}`;
      },
      className: "w-1/5",
    },
    {
      header: "Date & Time",
      accessorKey: (command: Command) => (
        <div>
          {command.createdAt ? formatDateTime(command.createdAt) : 'Unknown'}
        </div>
      ),
      className: "w-1/4",
    },
    {
      header: "Executed At",
      accessorKey: (command: Command) => (
        <div>
          {command.executedAt ? formatDateTime(command.executedAt) : 'Pending'}
        </div>
      ),
      className: "w-1/5",
    },
    {
      header: "Status",
      accessorKey: (command: Command) => (
        <Badge 
          variant="outline" 
          className={getStatusColor(command.status)}
        >
          {command.status}
        </Badge>
      ),
      className: "w-1/5 text-right",
    },
  ];
  
  // All possible command types
  const allCommandTypes = ['alarm', 'lock', 'wipe', 'photo', 'recording', 'refresh'];
  
  // All possible status types
  const allStatusTypes = ['pending', 'executed', 'failed'];
  
  return (
    <Layout>
      <div className="border-b border-gray-800 bg-dark-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Command History</h1>
            <p className="text-sm text-gray-400">View all commands and their status</p>
          </div>
          <div className="flex items-center space-x-3">
            <Select value={selectedDeviceId?.toString() || "all"} onValueChange={handleDeviceChange}>
              <SelectTrigger className="w-[200px] bg-dark-900 border-gray-700">
                <SelectValue placeholder="All Devices" />
              </SelectTrigger>
              <SelectContent className="bg-dark-800 border-gray-700">
                <SelectItem value="all">All Devices</SelectItem>
                {devices.map((device) => (
                  <SelectItem key={device.id} value={device.id.toString()}>
                    {device.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="bg-dark-900 border-gray-700">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                  {(commandTypes.length > 0 || statusTypes.length > 0) && (
                    <span className="ml-1 bg-primary-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {commandTypes.length + statusTypes.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-dark-800 border-gray-700">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Command Types</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {allCommandTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`command-${type}`} 
                            checked={commandTypes.includes(type)}
                            onCheckedChange={() => toggleCommandType(type)}
                          />
                          <Label htmlFor={`command-${type}`} className="text-sm">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {allStatusTypes.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`status-${status}`} 
                            checked={statusTypes.includes(status)}
                            onCheckedChange={() => toggleStatusType(status)}
                          />
                          <Label htmlFor={`status-${status}`} className="text-sm">
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-dark-900 border-gray-700"
                      onClick={() => {
                        setCommandTypes([]);
                        setStatusTypes([]);
                      }}
                    >
                      Clear Filters
                    </Button>
                    <Button size="sm">
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6 flex flex-col space-y-6">
        <Card className="bg-dark-800 border-gray-800">
          <CardHeader className="px-4 py-3 border-b border-gray-800">
            <CardTitle className="text-base font-medium flex items-center">
              <History className="h-5 w-5 mr-2 text-primary-500" />
              Command History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : filteredCommands.length > 0 ? (
              <DataTable 
                data={filteredCommands} 
                columns={columns} 
                pagination={{
                  pageIndex: 0,
                  pageCount: 1,
                  onPageChange: () => {},
                }}
              />
            ) : (
              <div className="py-8 text-center text-gray-500">
                {commands.length > 0 
                  ? "No commands match your filter criteria." 
                  : "No commands have been sent yet."}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
