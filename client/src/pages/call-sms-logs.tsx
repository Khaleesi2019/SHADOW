import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Device } from "@shared/schema";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CallLogs } from "@/components/logs/CallLogs";
import { MessageLogs } from "@/components/logs/MessageLogs";
import { PhoneCall, MessageSquare } from "lucide-react";

export default function CallSmsLogs() {
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  
  // Get devices
  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(Number(deviceId));
  };
  
  return (
    <Layout>
      <div className="border-b border-gray-800 bg-dark-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Call & SMS Logs</h1>
            <p className="text-sm text-gray-400">View and filter call and message logs</p>
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
        <Tabs defaultValue="calls" className="w-full">
          <TabsList className="bg-dark-900">
            <TabsTrigger value="calls" className="flex items-center">
              <PhoneCall className="h-4 w-4 mr-2" />
              Call Logs
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              SMS Logs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calls">
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">Call History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <CallLogs deviceId={selectedDeviceId} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="messages">
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">Message History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <MessageLogs deviceId={selectedDeviceId} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
