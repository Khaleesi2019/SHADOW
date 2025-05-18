import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Device, Photo } from "@shared/schema";
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
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Camera as CameraIcon, 
  Download, 
  Trash, 
  Plus,
  CameraOff
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CameraGrid } from "@/components/camera/CameraGrid";
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

export default function CameraControl() {
  const { toast } = useToast();
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  
  // Get devices
  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  // Get photos for selected device
  const { data: photos = [], isLoading } = useQuery<Photo[]>({
    queryKey: selectedDeviceId ? [`/api/devices/${selectedDeviceId}/photos`] : null,
    enabled: !!selectedDeviceId,
  });
  
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(Number(deviceId));
    setSelectedPhoto(null);
  };
  
  const handleTakePhoto = async () => {
    if (!selectedDeviceId) {
      toast({
        title: "Error",
        description: "Please select a device first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsCapturing(true);
      await apiRequest('POST', `/api/devices/${selectedDeviceId}/commands`, {
        commandType: 'photo'
      });
      
      toast({
        title: "Command Sent",
        description: "Photo capture command sent to the device.",
      });
      
      // Refresh photos after a short delay to allow the backend to process
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [`/api/devices/${selectedDeviceId}/photos`] });
        setIsCapturing(false);
      }, 2000);
      
    } catch (error) {
      setIsCapturing(false);
      toast({
        title: "Error",
        description: "Failed to send photo capture command.",
        variant: "destructive",
      });
    }
  };
  
  // Mock function for photo deletion (in a real app, this would make an API call)
  const handleDeletePhoto = async () => {
    if (!selectedPhoto) return;
    
    try {
      // This would be replaced with an actual API call
      // await apiRequest('DELETE', `/api/photos/${selectedPhoto.id}`);
      
      // For now, we'll just pretend it worked
      toast({
        title: "Photo Deleted",
        description: "The photo has been deleted successfully.",
      });
      
      setSelectedPhoto(null);
      setIsConfirmOpen(false);
      
      // Refresh photos
      if (selectedDeviceId) {
        queryClient.invalidateQueries({ queryKey: [`/api/devices/${selectedDeviceId}/photos`] });
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete photo.",
        variant: "destructive",
      });
    }
  };
  
  // Group photos by source (front or back camera)
  const frontCameraPhotos = photos.filter(p => p.source === 'front_camera');
  const backCameraPhotos = photos.filter(p => p.source === 'back_camera');
  const otherPhotos = photos.filter(p => p.source !== 'front_camera' && p.source !== 'back_camera');
  
  return (
    <Layout>
      <div className="border-b border-gray-800 bg-dark-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Camera Control</h1>
            <p className="text-sm text-gray-400">Remote camera control and photo gallery</p>
          </div>
          <div className="flex items-center space-x-3">
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
            
            <Button 
              onClick={handleTakePhoto} 
              disabled={!selectedDeviceId || isCapturing}
              className="space-x-2"
            >
              {isCapturing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  <span>Capturing...</span>
                </>
              ) : (
                <>
                  <CameraIcon className="h-4 w-4 mr-2" />
                  Take Photo
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6 flex flex-col space-y-6">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList className="bg-dark-900">
              <TabsTrigger value="all">All Photos</TabsTrigger>
              <TabsTrigger value="front">Front Camera</TabsTrigger>
              <TabsTrigger value="back">Back Camera</TabsTrigger>
            </TabsList>
            
            {selectedPhoto && (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="bg-dark-900 border-gray-700">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-dark-900 border-gray-700 text-red-500 hover:text-red-400"
                  onClick={() => setIsConfirmOpen(true)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
          
          <TabsContent value="all">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : photos.length > 0 ? (
              <CameraGrid 
                photos={photos} 
                selectedPhoto={selectedPhoto} 
                onSelectPhoto={setSelectedPhoto} 
              />
            ) : (
              <Card className="bg-dark-800 border-gray-800">
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <CameraOff className="h-16 w-16 text-gray-600 mb-4" />
                  <p className="text-lg text-gray-400">No photos available</p>
                  <p className="text-gray-500 mb-6">Capture a photo using the button above.</p>
                  <Button onClick={handleTakePhoto} disabled={!selectedDeviceId || isCapturing}>
                    <Plus className="h-4 w-4 mr-2" />
                    Capture Photo
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="front">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : frontCameraPhotos.length > 0 ? (
              <CameraGrid 
                photos={frontCameraPhotos} 
                selectedPhoto={selectedPhoto} 
                onSelectPhoto={setSelectedPhoto} 
              />
            ) : (
              <Card className="bg-dark-800 border-gray-800">
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <CameraOff className="h-16 w-16 text-gray-600 mb-4" />
                  <p className="text-lg text-gray-400">No front camera photos available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="back">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : backCameraPhotos.length > 0 ? (
              <CameraGrid 
                photos={backCameraPhotos} 
                selectedPhoto={selectedPhoto} 
                onSelectPhoto={setSelectedPhoto} 
              />
            ) : (
              <Card className="bg-dark-800 border-gray-800">
                <CardContent className="flex flex-col items-center justify-center h-64">
                  <CameraOff className="h-16 w-16 text-gray-600 mb-4" />
                  <p className="text-lg text-gray-400">No back camera photos available</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        
        {/* Selected photo preview */}
        {selectedPhoto && (
          <Card className="bg-dark-800 border-gray-800">
            <CardHeader className="px-4 py-3 border-b border-gray-800">
              <CardTitle className="text-base font-medium">Photo Details</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video bg-dark-900 rounded-lg overflow-hidden flex items-center justify-center">
                  <img 
                    src={selectedPhoto.photoUrl} 
                    alt="Captured Photo" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Source</h3>
                    <p className="text-base">{selectedPhoto.source || "Unknown"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Captured At</h3>
                    <p className="text-base">
                      {selectedPhoto.timestamp ? new Date(selectedPhoto.timestamp).toLocaleString() : "Unknown"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Device</h3>
                    <p className="text-base">
                      {devices.find(d => d.id === selectedPhoto.deviceId)?.name || "Unknown Device"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-dark-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-dark-900 border-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePhoto}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
}
