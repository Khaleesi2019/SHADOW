import { useEffect, useState } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "@/lib/queryClient";
import { Layout } from "@/components/layouts/Layout";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatTimeAgo } from "@/lib/utils";
import { Smartphone, Tablet, Laptop, Dock, ArrowLeft } from "lucide-react";
import type { Device } from "@shared/schema";

export default function DeviceDetail() {
  const [, params] = useRoute<{ id: string }>("/device/:id");
  const deviceId = params?.id ? parseInt(params.id) : null;
  
  const { data: device, isLoading } = useQuery<Device>({
    queryKey: ['/api/devices', deviceId],
    queryFn: getQueryFn({ on401: "throw" }),
    enabled: !!deviceId,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!device) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Device Not Found</h2>
          <p className="text-gray-400 mb-6">The device you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </Layout>
    );
  }

  // Determine icon based on device type
  const DeviceIcon = () => {
    switch (device.deviceType.toLowerCase()) {
      case 'smartphone':
        return <Smartphone className="text-primary-400 h-6 w-6" />;
      case 'tablet':
        return <Tablet className="text-red-500 h-6 w-6" />;
      case 'laptop':
        return <Laptop className="text-blue-500 h-6 w-6" />;
      case 'desktop':
        return <Dock className="text-purple-500 h-6 w-6" />;
      default:
        return <Smartphone className="text-primary-400 h-6 w-6" />;
    }
  };

  return (
    <Layout>
      {/* TopBar */}
      <div className="border-b border-gray-800 bg-dark-800">
        <div className="px-4 py-3 flex items-center">
          <Button variant="ghost" className="mr-2" onClick={() => window.history.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center">
            <DeviceIcon />
            <div className="ml-3">
              <h1 className="text-xl font-bold">{device.name}</h1>
              <div className="flex items-center">
                <Badge variant={
                  device.status === 'online' ? "default" : 
                  device.status === 'idle' ? "outline" : "destructive"
                }>
                  {device.status}
                </Badge>
                <span className="text-xs text-gray-400 ml-2">
                  Last active: {device.lastActivity ? formatTimeAgo(device.lastActivity) : 'Never'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Device Detail Content */}
      <div className="p-4 md:p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Device Info Card */}
          <Card className="bg-dark-800 border-gray-800 lg:col-span-2">
            <CardHeader className="px-4 py-3 border-b border-gray-800">
              <CardTitle className="text-base font-medium">Device Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Model</p>
                    <p className="font-medium">{'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Platform</p>
                    <p className="font-medium">{device.platform || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">OS Version</p>
                    <p className="font-medium">{'Unknown'}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Battery</p>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{device.battery || 'Unknown'}%</span>
                      </div>
                      <Progress 
                        value={device.battery || 0} 
                        className={`h-2 bg-dark-900 ${
                          (device.battery || 0) > 50 ? 'text-green-500' :
                          (device.battery || 0) > 20 ? 'text-amber-500' : 'text-red-500'
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Memory Used</p>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">45%</span>
                      </div>
                      <Progress 
                        value={45} 
                        className="h-2 bg-dark-900 text-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Storage Used</p>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">62%</span>
                      </div>
                      <Progress 
                        value={62} 
                        className="h-2 bg-dark-900 text-purple-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {device.description && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <p className="text-sm text-gray-400">Description</p>
                  <p className="font-medium">{device.description}</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick Actions Card */}
          <Card className="bg-dark-800 border-gray-800">
            <CardHeader className="px-4 py-3 border-b border-gray-800">
              <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <QuickActions device={device} />
            </CardContent>
          </Card>
        </div>
        
        {/* Activity Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-dark-800 mb-4">
            <TabsTrigger value="all">All Activity</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="calls">Calls</TabsTrigger>
            <TabsTrigger value="messages">Messages</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <ActivityFeed device={device} limit={20} />
          </TabsContent>
          <TabsContent value="locations">
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">Location History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Location history will be displayed here */}
                <div className="text-center py-8 text-gray-400">
                  View detailed location history on the Location Tracking page
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="calls">
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">Call History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Call logs will be displayed here */}
                <div className="text-center py-8 text-gray-400">
                  View detailed call logs on the Call & SMS Logs page
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="messages">
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">Message History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Message logs will be displayed here */}
                <div className="text-center py-8 text-gray-400">
                  View detailed message logs on the Call & SMS Logs page
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="commands">
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">Command History</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Command history will be displayed here */}
                <div className="text-center py-8 text-gray-400">
                  View detailed command history on the Command History page
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}