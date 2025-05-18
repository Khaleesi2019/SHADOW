import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Device } from "@shared/schema";
import { Bell, Lock, Camera, Mic } from "lucide-react";
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
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface QuickActionsProps {
  device?: Device;
}

export function QuickActions({ device }: QuickActionsProps) {
  const { toast } = useToast();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: string;
    title: string;
    description: string;
  } | null>(null);

  const actions = [
    {
      title: "Trigger Alarm",
      icon: <Bell className="text-red-500" />,
      iconBg: "bg-red-900/50",
      commandType: "alarm",
      description: "This will make the device emit a loud alarm sound even if it's on silent mode."
    },
    {
      title: "Lock Device",
      icon: <Lock className="text-yellow-500" />,
      iconBg: "bg-yellow-900/50",
      commandType: "lock",
      description: "This will lock the device immediately and require a PIN to unlock."
    },
    {
      title: "Take Photo",
      icon: <Camera className="text-green-500" />,
      iconBg: "bg-green-900/50",
      commandType: "photo",
      description: "This will secretly take a photo using the device's front camera."
    },
    {
      title: "Record Audio",
      icon: <Mic className="text-blue-500" />,
      iconBg: "bg-blue-900/50",
      commandType: "recording",
      description: "This will start recording audio from the device's microphone."
    }
  ];

  const handleAction = async (actionType: string) => {
    if (!device) {
      toast({
        title: "Error",
        description: "No device selected. Please select a device first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await apiRequest('POST', `/api/devices/${device.id}/commands`, {
        commandType: actionType
      });
      
      queryClient.invalidateQueries({ queryKey: [`/api/devices/${device.id}/commands`] });
      
      toast({
        title: "Command Sent",
        description: `The ${actionType} command has been sent to the device.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send command. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsConfirmOpen(false);
    setConfirmAction(null);
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="bg-dark-800 border border-gray-800 hover:bg-dark-700 rounded-lg p-4 h-auto flex flex-col items-center justify-center transition-all"
            onClick={() => {
              setConfirmAction({
                type: action.commandType,
                title: action.title,
                description: action.description
              });
              setIsConfirmOpen(true);
            }}
            disabled={!device}
          >
            <div className={`h-10 w-10 rounded-full ${action.iconBg} flex items-center justify-center mb-3`}>
              {action.icon}
            </div>
            <span className="text-sm font-medium">{action.title}</span>
          </Button>
        ))}
      </div>
      
      {/* Confirm action dialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent className="bg-dark-800 border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm {confirmAction?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.description}
              <div className="mt-4 bg-dark-900 rounded-md p-3 text-sm text-yellow-500">
                <Bell className="inline-block mr-2 h-4 w-4" />
                This action cannot be undone and may alert the device user.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-dark-900 border-gray-700"
              onClick={() => {
                setIsConfirmOpen(false);
                setConfirmAction(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              className="bg-red-600 hover:bg-red-700" 
              onClick={() => handleAction(confirmAction?.type || '')}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
