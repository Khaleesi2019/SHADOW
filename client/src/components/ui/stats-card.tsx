import * as React from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  progress?: number;
  description?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  color,
  bgColor,
  progress,
  description,
  className,
  ...props
}: StatsCardProps) {
  return (
    <Card className={cn("bg-dark-800 border-gray-800", className)} {...props}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
          <div className={cn("h-12 w-12 rounded-full flex items-center justify-center", bgColor)}>
            {React.cloneElement(icon as React.ReactElement, { 
              className: cn("text-xl", color) 
            })}
          </div>
        </div>
        
        {(progress !== undefined || description) && (
          <div className="mt-4">
            {progress !== undefined && (
              <>
                <Progress value={progress} className="h-1.5 bg-dark-900" indicatorColor={color} />
                <p className="text-xs text-gray-400 mt-1">{description || `${progress}% complete`}</p>
              </>
            )}
            {!progress && description && (
              <p className="text-xs text-gray-400 mt-1">{description}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
