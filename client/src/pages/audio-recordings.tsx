import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Device, Recording } from "@shared/schema";
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
import { Button } from "@/components/ui/button";
import { 
  Mic, 
  Download, 
  Trash, 
  Play, 
  Pause,
  Clock,
  Calendar,
  StopCircle,
  Music4
} from "lucide-react";
import { formatDuration, formatDateTime } from "@/lib/utils";
import { AudioPlayer } from "../components/audio/AudioPlayer";
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
import { DataTable } from "@/components/ui/data-table";

export default function AudioRecordings() {
  const { toast } = useToast();
  const [selectedDeviceId, setSelectedDeviceId] = useState<number | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Get devices
  const { data: devices = [] } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });
  
  // Get recordings for selected device
  const { data: recordings = [], isLoading } = useQuery<Recording[]>({
    queryKey: ['/api/recordings', selectedDeviceId],
    enabled: !!selectedDeviceId,
  });
  
  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(Number(deviceId));
    setSelectedRecording(null);
  };
  
  const handleStartRecording = async () => {
    if (!selectedDeviceId) {
      toast({
        title: "Error",
        description: "Please select a device first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsRecording(true);
      await apiRequest('POST', `/api/devices/${selectedDeviceId}/commands`, {
        commandType: 'recording'
      });
      
      toast({
        title: "Command Sent",
        description: "Audio recording command sent to the device.",
      });
      
      // In a real app, we'd wait for the recording to complete
      // For now, we'll just simulate it with a timeout
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [`/api/devices/${selectedDeviceId}/recordings`] });
        setIsRecording(false);
      }, 3000);
      
    } catch (error) {
      setIsRecording(false);
      toast({
        title: "Error",
        description: "Failed to send recording command.",
        variant: "destructive",
      });
    }
  };
  
  // Mock function for recording deletion (in a real app, this would make an API call)
  const handleDeleteRecording = async () => {
    if (!selectedRecording) return;
    
    try {
      // This would be replaced with an actual API call
      // await apiRequest('DELETE', `/api/recordings/${selectedRecording.id}`);
      
      // For now, we'll just pretend it worked
      toast({
        title: "Recording Deleted",
        description: "The recording has been deleted successfully.",
      });
      
      setSelectedRecording(null);
      setIsConfirmOpen(false);
      
      // Refresh recordings
      if (selectedDeviceId) {
        queryClient.invalidateQueries({ queryKey: [`/api/devices/${selectedDeviceId}/recordings`] });
      }
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete recording.",
        variant: "destructive",
      });
    }
  };
  
  // Define columns for recordings table
  const columns = [
    {
      header: "Date & Time",
      accessorKey: (recording: Recording) => (
        <div>
          <div className="font-medium">{recording.timestamp ? formatDateTime(recording.timestamp) : 'Unknown date'}</div>
          <div className="text-xs text-gray-500">
            {devices.find(d => d.id === recording.deviceId)?.name || "Unknown device"}
          </div>
        </div>
      ),
      className: "w-1/3",
    },
    {
      header: "Duration",
      accessorKey: (recording: Recording) => (
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          <span>{recording.duration ? formatDuration(recording.duration) : "Unknown"}</span>
        </div>
      ),
      className: "w-1/4",
    },
    {
      header: "Actions",
      accessorKey: (recording: Recording) => (
        <div className="flex space-x-2 justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRecording(recording === selectedRecording ? null : recording);
            }}
            className="text-primary-400 hover:text-primary-300"
          >
            {recording === selectedRecording ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              // Download action would go here
            }}
            className="text-gray-400 hover:text-white"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedRecording(recording);
              setIsConfirmOpen(true);
            }}
            className="text-red-500 hover:text-red-400"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
      className: "w-1/4 text-right",
    },
  ];
  
  return (
    <Layout>
      <div className="border-b border-gray-800 bg-dark-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Audio Recordings</h1>
            <p className="text-sm text-gray-400">Remote audio recording and playback</p>
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
              onClick={handleStartRecording} 
              disabled={!selectedDeviceId || isRecording}
              className="space-x-2"
            >
              {isRecording ? (
                <>
                  <StopCircle className="h-4 w-4 mr-2 text-red-500 animate-pulse" />
                  Recording...
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4 mr-2" />
                  Start Recording
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4 md:p-6 flex flex-col space-y-6">
        {/* Recordings list */}
        <Card className="bg-dark-800 border-gray-800">
          <CardHeader className="px-4 py-3 border-b border-gray-800">
            <CardTitle className="text-base font-medium">Recordings</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : recordings && recordings.length > 0 ? (
              <DataTable data={recordings} columns={columns} onRowClick={(recording) => setSelectedRecording(recording === selectedRecording ? null : recording)} />
            ) : (
              <div className="flex flex-col items-center justify-center h-64">
                <Music4 className="h-16 w-16 text-gray-600 mb-4" />
                <p className="text-lg text-gray-400">No recordings available</p>
                <p className="text-gray-500 mb-6">Start a recording using the button above.</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Audio player */}
        {selectedRecording && (
          <Card className="bg-dark-800 border-gray-800">
            <CardHeader className="px-4 py-3 border-b border-gray-800">
              <CardTitle className="text-base font-medium">Now Playing</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <AudioPlayer 
                    src={selectedRecording.recordingUrl} 
                    title={selectedRecording.timestamp ? formatDateTime(selectedRecording.timestamp) : 'Unknown date'}
                    subtitle={devices.find(d => d.id === selectedRecording?.deviceId)?.name || "Unknown device"}
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Recorded On</h3>
                    <div className="flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="text-base">{selectedRecording.timestamp ? formatDateTime(selectedRecording.timestamp) : 'Unknown date'}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Duration</h3>
                    <div className="flex items-center mt-1">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <p className="text-base">{selectedRecording.duration ? formatDuration(selectedRecording.duration) : "Unknown"}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-400">Device</h3>
                    <p className="text-base mt-1">
                      {devices.find(d => d.id === selectedRecording.deviceId)?.name || "Unknown Device"}
                    </p>
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <Button variant="outline" className="bg-dark-900 border-gray-700">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button 
                      variant="outline" 
                      className="bg-dark-900 border-gray-700 text-red-500 hover:text-red-400"
                      onClick={() => setIsConfirmOpen(true)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
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
              Are you sure you want to delete this recording? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-dark-900 border-gray-700">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteRecording}
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
