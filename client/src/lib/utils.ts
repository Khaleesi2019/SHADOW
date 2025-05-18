import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to format time ago
export function formatTimeAgo(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Function to format date
export function formatDate(date: Date | string | number, formatString: string = "PPP"): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, formatString);
}

// Function to format time
export function formatTime(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, "h:mm a");
}

// Function to format date and time
export function formatDateTime(date: Date | string | number): string {
  const dateObj = date instanceof Date ? date : new Date(date);
  return format(dateObj, "PPP p");
}

// Format phone number
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phoneNumber;
}

// Function to format duration in seconds to minutes:seconds
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

// Convert status to tag color
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "online":
      return "text-green-500 bg-green-900/30";
    case "offline":
      return "text-red-500 bg-red-900/30";
    case "idle":
      return "text-amber-500 bg-amber-900/30";
    case "pending":
      return "text-blue-500 bg-blue-900/30";
    case "executed":
      return "text-green-500 bg-green-900/30";
    case "failed":
      return "text-red-500 bg-red-900/30";
    default:
      return "text-gray-500 bg-gray-900/30";
  }
}

// Get platform color
export function getPlatformColor(platform: string): string {
  switch (platform.toLowerCase()) {
    case "ios":
      return "text-blue-400 bg-blue-900/30";
    case "android":
      return "text-green-400 bg-green-900/30";
    case "windows":
      return "text-cyan-400 bg-cyan-900/30";
    case "macos":
      return "text-purple-400 bg-purple-900/30";
    case "linux":
      return "text-orange-400 bg-orange-900/30";
    default:
      return "text-gray-400 bg-gray-900/30";
  }
}
