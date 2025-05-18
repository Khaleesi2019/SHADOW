import * as React from "react";
import { cn } from "@/lib/utils";
import { formatTime } from "@/lib/utils";

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  points: TimelinePoint[];
}

interface TimelinePoint {
  id: number | string;
  time: Date | string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function Timeline({ points, className, ...props }: TimelineProps) {
  return (
    <div className={cn("relative py-2", className)} {...props}>
      {/* Timeline track */}
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 transform -translate-y-1/2" />
      
      {/* Timeline points */}
      <div className="flex justify-between relative z-10">
        {points.map((point, index) => (
          <div 
            key={point.id} 
            className={cn(
              "flex flex-col items-center",
              index === points.length - 1 && !point.active && "opacity-40"
            )}
          >
            <div 
              className={cn(
                "w-3 h-3 rounded-full border-2 border-dark-900 mb-1 cursor-pointer transition-all hover:scale-110",
                point.active ? "bg-primary-400" : "bg-gray-500"
              )}
              onClick={point.onClick}
            />
            <span className="text-xs text-gray-400">
              {point.time instanceof Date ? formatTime(point.time) : point.time}
            </span>
            <span className="text-xs text-gray-500">{point.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
