import { useState } from "react";
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
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database, 
  HardDrive,
  Trash2,
  LogOut,
  CheckCircle2
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
  
  const handleSaveProfile = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };
  
  const handleDeleteAccount = () => {
    setIsDeleteAccountOpen(false);
    
    // This would make an actual API call in a real app
    toast({
      title: "Account Deleted",
      description: "Your account has been scheduled for deletion.",
    });
    
    // Redirect to logout
    setTimeout(() => {
      window.location.href = '/api/logout';
    }, 2000);
  };
  
  const getInitials = () => {
    if (!user) return 'AU';
    if (user.firstName && user.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`;
    }
    return user.email ? user.email[0].toUpperCase() : 'AU';
  };
  
  return (
    <Layout>
      <div className="border-b border-gray-800 bg-dark-800">
        <div className="px-4 py-3">
          <h1 className="text-xl font-bold">Settings</h1>
          <p className="text-sm text-gray-400">Manage your account and preferences</p>
        </div>
      </div>
      
      <div className="p-4 md:p-6 flex flex-col space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="bg-dark-900">
            <TabsTrigger value="profile" className="flex items-center">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="storage" className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Storage
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6 mt-6">
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">User Information</CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-6">
                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={user?.profileImageUrl} />
                      <AvatarFallback className="bg-primary-700 text-white text-xl">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      variant="link" 
                      className="mt-2 text-primary-400 hover:text-primary-300"
                    >
                      Change Avatar
                    </Button>
                  </div>
                  
                  <div className="flex-1 grid gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          defaultValue={user?.firstName || ''} 
                          className="bg-dark-900 border-gray-700"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          defaultValue={user?.lastName || ''} 
                          className="bg-dark-900 border-gray-700"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        defaultValue={user?.email || ''} 
                        className="bg-dark-900 border-gray-700"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t border-gray-800 flex justify-end">
                <Button 
                  onClick={handleSaveProfile}
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
              </CardFooter>
            </Card>
            
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium text-red-500">Danger Zone</CardTitle>
                <CardDescription className="text-gray-400">
                  Permanent account actions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Delete Account</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setIsDeleteAccountOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6 mt-6">
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">Email Notifications</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure when you receive email notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-device-offline" className="flex items-center cursor-pointer">
                      <span>Device goes offline</span>
                    </Label>
                    <Switch id="email-device-offline" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-command-executed" className="flex items-center cursor-pointer">
                      <span>Command executed</span>
                    </Label>
                    <Switch id="email-command-executed" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-device-added" className="flex items-center cursor-pointer">
                      <span>New device added</span>
                    </Label>
                    <Switch id="email-device-added" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-weekly-report" className="flex items-center cursor-pointer">
                      <span>Weekly activity report</span>
                    </Label>
                    <Switch id="email-weekly-report" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t border-gray-800 flex justify-end">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
            
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">Push Notifications</CardTitle>
                <CardDescription className="text-gray-400">
                  Configure push notifications on your devices
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-alerts" className="flex items-center cursor-pointer">
                      <span>Critical alerts</span>
                    </Label>
                    <Switch id="push-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-commands" className="flex items-center cursor-pointer">
                      <span>Command status updates</span>
                    </Label>
                    <Switch id="push-commands" defaultChecked />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t border-gray-800 flex justify-end">
                <Button>Save Preferences</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6 mt-6">
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">Authentication</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your authentication settings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-2">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-3 bg-dark-900 rounded-md">
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 rounded-full bg-green-900/30 flex items-center justify-center">
                        <Shield className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm">Two-factor authentication is disabled</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Add an extra layer of security to your account by enabling 2FA
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="bg-dark-900 border-gray-700">
                      Enable
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Session Management</h3>
                  <div className="bg-dark-900 rounded-md">
                    <div className="p-3 border-b border-gray-800">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">Current Session</p>
                          <p className="text-xs text-gray-500 mt-1">
                            Browser: Chrome on Windows • Last active: Just now
                          </p>
                        </div>
                        <span className="text-xs text-green-500 bg-green-900/30 px-2 py-1 rounded">Active</span>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm">Mobile App</p>
                          <p className="text-xs text-gray-500 mt-1">
                            iPhone 13 • Last active: 2 hours ago
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="bg-dark-900 border-gray-700 text-red-500 hover:text-red-400">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t border-gray-800 flex justify-between">
                <Button 
                  variant="outline" 
                  className="bg-dark-900 border-gray-700 text-red-500 hover:text-red-400"
                >
                  Log Out All Devices
                </Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Storage Tab */}
          <TabsContent value="storage" className="space-y-6 mt-6">
            <Card className="bg-dark-800 border-gray-800">
              <CardHeader className="px-4 py-3 border-b border-gray-800">
                <CardTitle className="text-base font-medium">Storage Usage</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage storage usage and data retention
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <h3 className="text-sm font-medium">Used Storage: 48.2 GB / 80 GB</h3>
                    <span className="text-xs text-gray-500">60% used</span>
                  </div>
                  <div className="w-full bg-dark-900 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-dark-900 p-3 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-blue-900/30 flex items-center justify-center">
                        <Camera className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Photos</p>
                        <p className="text-xs text-gray-500">28.5 GB • 73% of storage</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-dark-900 p-3 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-purple-900/30 flex items-center justify-center">
                        <Mic className="h-4 w-4 text-purple-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Audio Recordings</p>
                        <p className="text-xs text-gray-500">12.6 GB • 21% of storage</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-dark-900 p-3 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-amber-900/30 flex items-center justify-center">
                        <HardDrive className="h-4 w-4 text-amber-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Logs & Data</p>
                        <p className="text-xs text-gray-500">5.8 GB • 5% of storage</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-dark-900 p-3 rounded-md">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-green-900/30 flex items-center justify-center">
                        <Database className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Other</p>
                        <p className="text-xs text-gray-500">1.3 GB • 1% of storage</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Data Retention Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="retain-photos" className="flex items-center cursor-pointer">
                        <span>Auto-delete photos after 90 days</span>
                      </Label>
                      <Switch id="retain-photos" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="retain-recordings" className="flex items-center cursor-pointer">
                        <span>Auto-delete recordings after 30 days</span>
                      </Label>
                      <Switch id="retain-recordings" defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="retain-logs" className="flex items-center cursor-pointer">
                        <span>Auto-delete logs after 14 days</span>
                      </Label>
                      <Switch id="retain-logs" defaultChecked />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-3 border-t border-gray-800 flex justify-between">
                <Button 
                  variant="outline" 
                  className="bg-dark-900 border-gray-700 text-red-500 hover:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Data
                </Button>
                <Button>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Delete account confirmation dialog */}
      <AlertDialog open={isDeleteAccountOpen} onOpenChange={setIsDeleteAccountOpen}>
        <AlertDialogContent className="bg-dark-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-dark-900 border-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAccount}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
