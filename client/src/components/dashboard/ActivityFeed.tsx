import { useEffect, useState } from 'react';
import { ActivityFeed as ActivityFeedComponent } from "@/components/ui/activity-feed";
import { useQuery } from "@tanstack/react-query";
import { Device, Call, Message, Location, Photo, Recording, Command } from "@shared/schema";
import { ActivityItem } from "@shared/types";

interface ActivityFeedProps {
  device?: Device;
  limit?: number;
}

export function ActivityFeed({ device, limit = 10 }: ActivityFeedProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  // Fetch device calls if device is provided
  const { data: calls = [] } = useQuery<Call[]>({
    queryKey: device ? [`/api/devices/${device.id}/calls`, { limit }] : null,
    enabled: !!device,
  });

  // Fetch device messages if device is provided
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: device ? [`/api/devices/${device.id}/messages`, { limit }] : null,
    enabled: !!device,
  });

  // Fetch device locations if device is provided
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: device ? [`/api/devices/${device.id}/locations`, { limit }] : null,
    enabled: !!device,
  });

  // Fetch device photos if device is provided
  const { data: photos = [] } = useQuery<Photo[]>({
    queryKey: device ? [`/api/devices/${device.id}/photos`, { limit }] : null,
    enabled: !!device,
  });

  // Fetch device recordings if device is provided
  const { data: recordings = [] } = useQuery<Recording[]>({
    queryKey: device ? [`/api/devices/${device.id}/recordings`, { limit }] : null,
    enabled: !!device,
  });

  // Fetch device commands if device is provided
  const { data: commands = [] } = useQuery<Command[]>({
    queryKey: device ? [`/api/devices/${device.id}/commands`, { limit }] : null,
    enabled: !!device,
  });

  // Combine and sort all activities
  useEffect(() => {
    const allActivities: ActivityItem[] = [
      // Calls
      ...calls.map(call => ({
        id: `call-${call.id}`,
        type: 'call',
        title: `${call.callType === 'incoming' ? 'Incoming call from' : 'Outgoing call to'} ${call.phoneNumber}`,
        description: `Duration: ${call.duration ? Math.floor(call.duration / 60) + ':' + (call.duration % 60).toString().padStart(2, '0') : 'N/A'}`,
        timestamp: new Date(call.timestamp),
        iconBg: 'bg-green-900',
        iconColor: 'text-green-500'
      })),
      
      // Messages
      ...messages.map(message => ({
        id: `message-${message.id}`,
        type: 'message',
        title: `${message.messageType === 'incoming' ? 'Received message from' : 'Sent message to'} ${message.phoneNumber}`,
        description: message.content ? `"${message.content.length > 30 ? message.content.substring(0, 30) + '...' : message.content}"` : 'No content',
        timestamp: new Date(message.timestamp),
        iconBg: 'bg-purple-900',
        iconColor: 'text-purple-500'
      })),
      
      // Locations
      ...locations.map(location => ({
        id: `location-${location.id}`,
        type: 'location',
        title: 'New location detected',
        description: location.address || `${location.latitude}, ${location.longitude}`,
        timestamp: new Date(location.timestamp),
        iconBg: 'bg-blue-900',
        iconColor: 'text-blue-500'
      })),
      
      // Photos
      ...photos.map(photo => ({
        id: `photo-${photo.id}`,
        type: 'photo',
        title: 'Photo captured',
        description: photo.source || 'Camera',
        timestamp: new Date(photo.timestamp),
        iconBg: 'bg-indigo-900',
        iconColor: 'text-indigo-500'
      })),
      
      // Recordings
      ...recordings.map(recording => ({
        id: `recording-${recording.id}`,
        type: 'recording',
        title: 'Audio recorded',
        description: recording.duration ? `Duration: ${Math.floor(recording.duration / 60)}:${(recording.duration % 60).toString().padStart(2, '0')}` : 'Unknown duration',
        timestamp: new Date(recording.timestamp),
        iconBg: 'bg-amber-900',
        iconColor: 'text-amber-500'
      })),
      
      // Commands
      ...commands.map(command => ({
        id: `command-${command.id}`,
        type: 'command',
        title: `Command: ${command.commandType}`,
        description: `Status: ${command.status}`,
        timestamp: new Date(command.createdAt),
        iconBg: 'bg-red-900',
        iconColor: 'text-red-500'
      }))
    ];
    
    // If no device or no activities, provide sample activities
    if (!device || allActivities.length === 0) {
      // This section is left intentionally empty as we don't want to provide mock data
      // When there's no data, we'll show "No recent activity" message from the ActivityFeed component
    }
    
    // Sort by timestamp, most recent first
    allActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    // Limit the number of activities
    setActivities(allActivities.slice(0, limit));
  }, [calls, messages, locations, photos, recordings, commands, device, limit]);

  return (
    <ActivityFeedComponent 
      activities={activities}
      onViewAll={() => {
        // Navigate to full activity view
        window.location.href = device ? `/device/${device.id}/activity` : '/activity';
      }}
    />
  );
}
