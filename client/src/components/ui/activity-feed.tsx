import * as React from "react";
import { cn, formatTimeAgo } from "@/lib/utils";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  MapPin, 
  MessageSquare, 
  Wifi, 
  Battery, 
  Camera, 
  Mic, 
  Settings 
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ActivityItem } from "@shared/types";

interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
  activities: ActivityItem[];
  title?: string;
  onViewAll?: () => void;
  maxHeight?: string;
}

export function ActivityFeed({
  activities,
  title = "Recent Activity",
  onViewAll,
  maxHeight = "max-h-72",
  className,
  ...props
}: ActivityFeedProps) {
  // Function to get icon based on activity type
  const getIcon = (type: string) => {
    switch (type) {
      case 'call':
        return <Phone className="text-xs" />;
      case 'location':
        return <MapPin className="text-xs" />;
      case 'message':
        return <MessageSquare className="text-xs" />;
      case 'wifi':
        return <Wifi className="text-xs" />;
      case 'battery':
        return <Battery className="text-xs" />;
      case 'photo':
        return <Camera className="text-xs" />;
      case 'recording':
        return <Mic className="text-xs" />;
      case 'command':
        return <Settings className="text-xs" />;
      default:
        return <Settings className="text-xs" />;
    }
  };

  return (
    <Card className={cn("bg-dark-800 border-gray-800 overflow-hidden", className)} {...props}>
      <CardHeader className="px-4 py-3 border-b border-gray-800">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      
      <ScrollArea className={cn("overflow-y-auto", maxHeight)}>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-800">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div key={activity.id} className="px-4 py-3 hover:bg-dark-900/50">
                  <div className="flex">
                    <div 
                      className={cn(
                        "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center", 
                        activity.iconBg || "bg-blue-900"
                      )}
                    >
                      {activity.icon ? 
                        <span className={cn("text-xs", activity.iconColor || "text-blue-500")}>{activity.icon}</span> : 
                        <span className={cn("text-xs", activity.iconColor || "text-blue-500")}>{getIcon(activity.type)}</span>
                      }
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatTimeAgo(activity.timestamp)} · {activity.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-gray-500">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </CardContent>
      </ScrollArea>
      
      {onViewAll && (
        <CardFooter className="px-4 py-3 bg-dark-900/60 flex justify-center border-t border-gray-800">
          <Button 
            variant="link" 
            className="text-primary-400 hover:text-primary-300 text-sm font-medium"
            onClick={onViewAll}
          >
            View All Activity
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
